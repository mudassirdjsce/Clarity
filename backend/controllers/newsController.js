const News = require("../models/News");

const getNews = async (req, res) => {
  try {
    const { mode = "retail", sentiment, impact, search } = req.query;

    let query = {};
    if (sentiment) query.sentiment = sentiment;
    if (impact) query.impact = impact;
    if (search) query.title = { $regex: search, $options: "i" };

    const news = await News.find(query).sort({ publishedAt: -1 }).limit(50);

    if (mode === "retail") {
      return res.json(news.map(n => ({
        title: n.title,
        summary: n.summary,
        sentiment: n.sentiment,
        impact: n.impact
      })));
    }

    res.json(news);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNews };