const cron = require("node-cron");
const axios = require("axios");

const News = require("../models/News");

// ================= FETCH FUNCTIONS =================

const fetchFinnhub = async () => {
  try {
    const res = await axios.get(
      `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY?.trim()}`
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
      `https://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.NEWS_API_KEY?.trim()}`
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
    url: item.url || null,
    description: item.summary || "",
    source: item.source || "Unknown",
    publishedAt: item.datetime ? item.datetime * 1000 : new Date()
  }));
};

const normalizeNewsAPI = (data) => {
  return data.map(item => ({
    title: item.title || "No Title",
    url: item.url || null,
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

    // ── Purge articles older than 7 days to keep the DB fresh ──────────────
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const purged = await News.deleteMany({ publishedAt: { $lt: sevenDaysAgo } });
    if (purged.deletedCount > 0) {
      console.log(`🗑️  Purged ${purged.deletedCount} old articles`);
    }

    // ── Collect existing URLs + titles to avoid duplicates ─────────────────
    const existingUrls = new Set(
      (await News.find({}, { url: 1, _id: 0 })).map(n => n.url).filter(Boolean)
    );
    const existingTitles = new Set(
      (await News.find({}, { title: 1, _id: 0 })).map(n => n.title)
    );

    let insertedCount = 0;
    let skippedCount = 0;

    for (let article of data) {
      try {
        // ── Skip duplicates by URL (preferred) or title ───────────────────
        if (article.url && existingUrls.has(article.url)) {
          skippedCount++;
          continue;
        }
        if (existingTitles.has(article.title)) {
          skippedCount++;
          continue;
        }

        const ai = await analyzeNews(article);

        const saved = await News.create({
          title: article.title,
          url: article.url || null,
          summary: ai.summary,
          fullSummary: article.description || ai.summary,
          sentiment: ai.sentiment,
          impact: ai.impact,
          credibilityScore: calculateCredibility(),
          source: article.source,
          publishedAt: article.publishedAt,
          tags: article.title.split(" ").slice(0, 6),
          mode: "both",
          featured: false,
          relatedAssets: [],
          sparkData: [],
        });

        // Track to avoid intra-batch duplicates
        if (article.url) existingUrls.add(article.url);
        existingTitles.add(article.title);

        insertedCount++;
        console.log("✅ Saved:", saved.title.slice(0, 60));

      } catch (err) {
        console.error("❌ Insert Error for article:", article.title?.slice(0, 60));
        console.error("   Reason:", err.message);
      }
    }

    console.log(`🎉 DONE: Inserted ${insertedCount} | Skipped (duplicates) ${skippedCount}`);

  } catch (err) {
    console.error("Pipeline Error:", err.message);
  }
};

// ================= CRON =================

const startNewsCron = () => {
  // Run immediately on startup, then every 10 minutes
  runNewsPipeline();
  cron.schedule("*/10 * * * *", runNewsPipeline);
};

// ================= EXPORT =================

module.exports = { startNewsCron, runNewsPipeline };