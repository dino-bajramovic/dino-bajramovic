/**
 * Express backend with MongoDB persistence for contact submissions.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'changeme';
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || 'portfolioDB';
const COLLECTION = 'submissions';
const CANONICAL_HOST = (process.env.CANONICAL_HOST || '').toLowerCase();

if (!MONGO_URI) {
  console.warn('MONGO_URI is not set. Please configure it in .env');
}

const client = new MongoClient(MONGO_URI);
let collection;

const connectDB = async () => {
  if (collection) return collection;
  await client.connect();
  const db = client.db(MONGO_DB);
  collection = db.collection(COLLECTION);
  await collection.createIndex({ createdAt: -1 });
  // Backfill missing id field for legacy documents
  await collection.updateMany(
    { id: { $exists: false } },
    [
      {
        $set: {
          id: { $toString: '$_id' }
        }
      }
    ]
  );
  return collection;
};

const mapSubmission = (doc) => ({
  id: doc._id?.toString() || doc.id,
  name: doc.name,
  email: doc.email,
  message: doc.message,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const buildIdFilter = (id) => {
  const filters = [];
  if (ObjectId.isValid(id)) {
    filters.push({ _id: new ObjectId(id) });
  }
  filters.push({ id });
  filters.push({ _id: id }); // in case _id was stored as string for legacy docs
  return filters.length === 1 ? filters[0] : { $or: filters };
};

app.use(cors());
app.use(express.json());
app.enable('trust proxy');

app.use((req, res, next) => {
  const hostname = (req.hostname || '').toLowerCase();
  const originalHost = req.headers.host;
  const protoHeader = req.get('x-forwarded-proto');
  const proto = protoHeader || (req.secure ? 'https' : 'http');
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

  if (!isLocal && proto === 'http' && originalHost) {
    return res.redirect(301, `https://${originalHost}${req.originalUrl}`);
  }

  if (!isLocal && CANONICAL_HOST && hostname && hostname !== CANONICAL_HOST) {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }

  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/api/health', async (_req, res) => {
  try {
    await connectDB();
    res.json({ ok: true, uptime: process.uptime() });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB connection failed' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  const trimmedMessage = String(message).trim();
  if (trimmedMessage.length > 1000) {
    return res.status(400).json({ success: false, error: 'Message is too long (max 1000 characters).' });
  }

  try {
    const col = await connectDB();
    const doc = {
      id: undefined,
      name: String(name).trim(),
      email: String(email).trim(),
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };
    const result = await col.insertOne(doc);
    const entry = mapSubmission({ _id: result.insertedId, ...doc, id: result.insertedId.toString() });
    // Backfill id for future compatibility
    await col.updateOne({ _id: result.insertedId }, { $set: { id: entry.id } });
    return res.status(201).json({ success: true, entry });
  } catch (err) {
    console.error('Error inserting submission:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

const requireAdminKey = (req, res, next) => {
  const headerKey = req.headers['x-admin-key'];
  if (!headerKey || headerKey !== ADMIN_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
};

app.get('/api/submissions', requireAdminKey, async (_req, res) => {
  try {
    const col = await connectDB();
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, submissions: docs.map(mapSubmission) });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.delete('/api/submissions/:id', requireAdminKey, async (req, res) => {
  try {
    const col = await connectDB();
    const result = await col.deleteOne(buildIdFilter(req.params.id));
    res.json({ success: true, removed: result.deletedCount });
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.put('/api/submissions/:id', requireAdminKey, async (req, res) => {
  const { name, email, message } = req.body || {};

  if (message && String(message).trim().length > 1000) {
    return res.status(400).json({ success: false, error: 'Message is too long (max 1000 characters).' });
  }

  try {
    const col = await connectDB();
    const filter = buildIdFilter(req.params.id);
    const existing = await col.findOne(filter);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (email !== undefined) update.email = String(email).trim();
    if (message !== undefined) update.message = String(message).trim();
    update.updatedAt = new Date().toISOString();

    const result = await col.updateOne(filter, { $set: update });

    if (!result.matchedCount) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    const refreshed = await col.findOne(filter);
    res.json({ success: true, entry: mapSubmission(refreshed) });
  } catch (err) {
    console.error('Error updating submission:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '30d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Custom 404 for API and web requests
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'Route not found' });
  }

  const notFoundPage = path.join(__dirname, 'dist', '404.html');
  res.status(404).sendFile(notFoundPage);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
