import { getDb } from './_db.js';

const COLLECTION = 'submissions';
const MAX_MESSAGE = 1000;
const ALLOWED_ORIGINS = ['https://www.dinobajramovic.com', 'https://dinobajramovic.com'];

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch {
      return {};
    }
  }
  return req.body;
};

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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, message } = parseBody(req);
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  const trimmedMessage = String(message).trim();
  if (trimmedMessage.length > MAX_MESSAGE) {
    return res
      .status(400)
      .json({ success: false, error: `Message is too long (max ${MAX_MESSAGE} characters).` });
  }

  try {
    const db = await getDb();
    const col = db.collection(COLLECTION);

    const doc = {
      name: String(name).trim(),
      email: String(email).trim(),
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);
    const entry = { id: result.insertedId.toString(), ...doc };

    await col.updateOne({ _id: result.insertedId }, { $set: { id: entry.id } });

    return res.status(201).json({ success: true, entry });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
