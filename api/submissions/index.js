import { getDb } from '../_db.js';

const COLLECTION = 'submissions';
const ALLOWED_ORIGINS = ['https://www.dinobajramovic.com', 'https://dinobajramovic.com'];

function applyCors(req, res) {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const ADMIN_KEY = process.env.ADMIN_KEY || 'changeme';
  const headerKey = req.headers['x-admin-key'];
  if (!headerKey || headerKey !== ADMIN_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const db = await getDb();
    const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    const submissions = docs.map((d) => ({
      id: d._id?.toString() || d.id,
      name: d.name,
      email: d.email,
      message: d.message,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
    res.status(200).json({ success: true, submissions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
