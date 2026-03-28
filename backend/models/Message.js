const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    role:      { type: String, enum: ["user", "assistant"], required: true },
    content:   { type: String, required: true },
    // Structured response card — only present on assistant messages
    structured: {
      insight:        { type: String },
      riskLevel:      { type: String },
      warning:        { type: String },
      dataSources:    [{ type: String }],
      keyMetrics:     { type: mongoose.Schema.Types.Mixed },
      explanation:    { type: String },
      reasoning:      [{ type: String }],
      suggestion:     { type: String },
      confidenceScore:{ type: Number },
    },
    intent: { type: String }, // which agent handled this
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
