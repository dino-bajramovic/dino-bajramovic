import { ObjectId } from "mongodb";
import { getDb } from "../_db.js";

const COLLECTION = "submissions";
const MAX_MESSAGE = 1000;

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body || "{}");
    } catch {
      return {};
    }
  }
  return req.body;
};

function buildIdFilter(id) {
  const filters = [];
  if (ObjectId.isValid(id)) filters.push({ _id: new ObjectId(id) });
  filters.push({ id });
  filters.push({ _id: id });
  return { $or: filters };
}

// Za test može "*", kasnije stavi tačan domen (preporučeno).
const ALLOW_ORIGIN = process.env.CORS_ORIGIN || "*";

export default async function handler(req, res) {
  const method = String(req.method || "").toUpperCase();

  // CORS headers moraju biti postavljeni prije bilo kakvog return-a
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-key");

  // Ako je "*" ne smiješ slati Vary: Origin (nije kritično, ali čisto)
  if (ALLOW_ORIGIN === "*") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader("Vary", "Origin");
  }

  // Preflight mora vratiti 200 prije auth provjere
  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  // Admin auth (samo za PUT/DELETE)
  const ADMIN_KEY = process.env.ADMIN_KEY;
  const headerKey = req.headers["x-admin-key"];

  // Ako ADMIN_KEY nije postavljen na Vercelu -> fail hard (da ne misliš da radi)
  if (!ADMIN_KEY) {
    return res.status(500).json({ success: false, error: "ADMIN_KEY is missing on server" });
  }

  if (!headerKey || headerKey !== ADMIN_KEY) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    const db = await getDb();
    const col = db.collection(COLLECTION);
    const filter = buildIdFilter(id);

    if (method === "DELETE") {
      const result = await col.deleteOne(filter);
      return res.status(200).json({ success: true, removed: result.deletedCount });
    }

    if (method === "PUT") {
      const body = parseBody(req);
      const { name, email, message } = body;

      if (message && String(message).trim().length > MAX_MESSAGE) {
        return res
          .status(400)
          .json({ success: false, error: `Message is too long (max ${MAX_MESSAGE} characters).` });
      }

      const existing = await col.findOne(filter);
      if (!existing) {
        return res.status(404).json({ success: false, error: "Submission not found." });
      }

      const update = { updatedAt: new Date().toISOString() };
      if (name !== undefined) update.name = String(name).trim();
      if (email !== undefined) update.email = String(email).trim();
      if (message !== undefined) update.message = String(message).trim();

      await col.updateOne(filter, { $set: update });
      const refreshed = await col.findOne(filter);

      return res.status(200).json({
        success: true,
        entry: {
          id: refreshed._id?.toString() || refreshed.id,
          name: refreshed.name,
          email: refreshed.email,
          message: refreshed.message,
          createdAt: refreshed.createdAt,
          updatedAt: refreshed.updatedAt,
        },
      });
    }


    return res.status(405).json({ success: false, error: "Method Not Allowed", method });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
