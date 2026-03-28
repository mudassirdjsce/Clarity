const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
  type: String, // market_summary, sector_trend, risk_alert
  title: String,
  insight: String,
  sentiment: String,
  impact: String,
  confidence: Number,
  basedOn: Number, // number of articles used
  createdAt: { type: Date, default: Date.now }
});

insightSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Insight", insightSchema);