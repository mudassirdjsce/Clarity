const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userMode:  { type: String, enum: ["beginner", "pro"], default: "beginner" },
    lastAsset: { type: String, default: null },   // e.g. "AAPL"
    lastTopic: { type: String, default: null },   // e.g. "stock_analysis"
    messageCount: { type: Number, default: 0 },
    contextSummary: { type: String, default: "" }, // running summary for memory
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
