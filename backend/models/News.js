const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  summary:         String,
  fullSummary:     String,  // Retail-facing plain language breakdown
  fullAnalysis:    String,  // Institution-facing detailed analysis
  sentiment:       { type: String, enum: ["bullish", "bearish", "neutral"], default: "neutral" },
  impact:          { type: String, enum: ["high", "medium", "low"], default: "medium" },
  credibilityScore:{ type: Number, default: 80 },
  source:          String,
  publishedAt:     { type: Date, default: Date.now },
  tags:            [String],
  relatedAssets:   [String],
  featured:        { type: Boolean, default: false },
  sparkData:       [Number],     // Sparkline values for retail UI
  mode:            { type: String, enum: ["retail", "institution", "both"], default: "both" },
}, { timestamps: true });

newsSchema.index({ publishedAt: -1 });
newsSchema.index({ sentiment: 1 });
newsSchema.index({ impact: 1 });
newsSchema.index({ mode: 1 });

module.exports = mongoose.model("News", newsSchema);