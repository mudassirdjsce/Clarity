const Insight = require("../models/Insight");

const getInsights = async (req, res) => {
  try {
    const insights = await Insight.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInsights };