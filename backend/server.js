require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const { startNewsCron } = require("./cron/newsCron");

/** One-time: drop the bad TTL index on `createdAt` in the otps collection if it exists */
const cleanOtpIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: "otps" }).toArray();
    if (collections.length === 0) return; // collection doesn't exist yet — nothing to do

    const indexes = await db.collection("otps").indexes();
    for (const idx of indexes) {
      // Bad index: TTL on `createdAt` (expireAfterSeconds: 0 means delete immediately)
      if (idx.key && idx.key.createdAt !== undefined && idx.expireAfterSeconds !== undefined) {
        console.log(`[startup] Dropping bad TTL index "${idx.name}" on otps.createdAt`);
        await db.collection("otps").dropIndex(idx.name);
        console.log("[startup] Bad index dropped ✓");
      }
    }
  } catch (e) {
    console.warn("[startup] Could not clean OTP indexes:", e.message);
  }
};

const startServer = async () => {
  await connectDB();
  await cleanOtpIndexes();   // ← removes the self-destructing index if present
  startNewsCron();

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

startServer();