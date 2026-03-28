const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  sentiment: String,
  impact: String,
  credibilityScore: Number,
  source: String,
  publishedAt: Date,
  tags: [String]
}, { timestamps: true });

newsSchema.index({ publishedAt: -1 });
newsSchema.index({ sentiment: 1 });
newsSchema.index({ impact: 1 });

module.exports = mongoose.model("News", newsSchema);