const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  userData: {
    name:         { type: String, required: true },
    phone:        { type: String, required: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, default: "user" },
  },
  attempts: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // NOTE: NO `expires` here — we handle TTL via the expiresAt index below
  },
});

// ── TTL index: MongoDB auto-deletes the document when `expiresAt` is reached ──
// expireAfterSeconds: 0 means "delete when expiresAt <= now"
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
