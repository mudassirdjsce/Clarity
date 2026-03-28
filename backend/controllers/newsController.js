const News = require("../models/News");

// ── GET /api/news ─────────────────────────────────────────────────────────────
const getNews = async (req, res) => {
  try {
    const { mode = "retail", sentiment, impact, search } = req.query;

    // Build MongoDB query
    const query = {};

    // Mode filter — return news for this mode OR news marked "both"
    if (mode) {
      query.mode = { $in: [mode, "both"] };
    }

    // Sentiment filter
    if (sentiment && sentiment !== "all") {
      query.sentiment = sentiment;
    }

    // Impact filter
    if (impact && impact !== "all") {
      query.impact = impact;
    }

    // Search across title, tags, and source
    if (search) {
      query.$or = [
        { title:  { $regex: search, $options: "i" } },
        { tags:   { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } },
      ];
    }

    const news = await News.find(query).sort({ publishedAt: -1 }).limit(50);

    // Retail mode: return full object (frontend picks its own fields)
    // Institution mode: same — return full object
    res.json(news);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNews };