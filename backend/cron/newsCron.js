const cron = require("node-cron");
const axios = require("axios");

const News = require("../models/News");

// ================= FETCH FUNCTIONS =================

const fetchFinnhub = async () => {
  try {
    const res = await axios.get(
      `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
    );
    console.log("Finnhub fetched:", res.data.length);
    return res.data;
  } catch (err) {
    console.error("Finnhub Error:", err.message);
    return [];
  }
};

const fetchNewsAPI = async () => {
  try {
    const res = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.NEWS_API_KEY}`
    );
    console.log("NewsAPI fetched:", res.data.articles.length);
    return res.data.articles;
  } catch (err) {
    console.error("NewsAPI Error:", err.message);
    return [];
  }
};

// ================= NORMALIZATION =================

const normalizeFinnhub = (data) => {
  return data.map(item => ({
    title: item.headline || "No Title",
    description: item.summary || "",
    source: item.source || "Unknown",
    publishedAt: item.datetime ? item.datetime * 1000 : new Date()
  }));
};

const normalizeNewsAPI = (data) => {
  return data.map(item => ({
    title: item.title || "No Title",
    description: item.description || "",
    source: item.source?.name || "Unknown",
    publishedAt: item.publishedAt || new Date()
  }));
};

// ================= AI MOCK (SAFE FALLBACK) =================

const analyzeNews = async (article) => {
  // ⚠️ FOR NOW: skip Gemini to avoid failure
  return {
    summary: article.title,
    sentiment: "neutral",
    impact: "low"
  };
};

// ================= CREDIBILITY =================

const calculateCredibility = () => {
  return Math.floor(Math.random() * 40) + 60; // random 60–100
};

// ================= MAIN PIPELINE =================

const runNewsPipeline = async () => {
  try {
    console.log("🚀 Running News Pipeline...");

    const finnhubRaw = await fetchFinnhub();
    const newsapiRaw = await fetchNewsAPI();

    let data = [
      ...normalizeFinnhub(finnhubRaw),
      ...normalizeNewsAPI(newsapiRaw)
    ];

    console.log("Total fetched:", data.length);

    if (data.length === 0) {
      console.log("❌ No data fetched from APIs");
      return;
    }

    let insertedCount = 0;

    for (let article of data) {
      try {
        // ── Skip duplicates ──────────────────────────────────────────────────
        const exists = await News.findOne({ title: article.title });
        if (exists) continue;

        const ai = await analyzeNews(article);

        const saved = await News.create({
          title: article.title,
          summary: ai.summary,
          fullSummary: article.description || ai.summary,
          sentiment: ai.sentiment,
          impact: ai.impact,
          credibilityScore: calculateCredibility(),
          source: article.source,
          publishedAt: article.publishedAt,
          tags: article.title.split(" ").slice(0, 6), // cap at 6 tags
          mode: "both",  // visible to both retail and institution
          featured: false,
          relatedAssets: [],
          sparkData: [],
        });

        insertedCount++;
        console.log("✅ Saved:", saved.title);

      } catch (err) {
        console.error("Insert Error:", err.message);
      }
    }

    console.log(`🎉 DONE: Inserted ${insertedCount} articles`);

  } catch (err) {
    console.error("Pipeline Error:", err.message);
  }
};

// ================= CRON =================

const startNewsCron = () => {
  cron.schedule("*/10 * * * *", runNewsPipeline);
};

// ================= EXPORT =================

module.exports = { startNewsCron, runNewsPipeline };