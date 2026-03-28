const axios = require("axios");

const NEWS_API_BASE = "https://newsapi.org/v2";
const API_KEY = process.env.NEWS_API_KEY;

// Simple in-memory cache
const cache = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const isCached = (key) =>
  cache[key] && Date.now() - cache[key].fetchedAt < CACHE_TTL_MS;

/**
 * Fetch top financial news headlines for a topic or stock ticker
 * @param {string} query - e.g. "AAPL", "inflation", "IT stocks"
 * @param {number} pageSize - number of articles (max 5 for free tier)
 */
const fetchFinancialNews = async (query, pageSize = 5) => {
  const key = `news_${query}`;
  if (isCached(key)) return cache[key].data;

  try {
    const { data } = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        pageSize,
        apiKey: API_KEY,
      },
    });

    const articles = (data.articles || []).map((a) => ({
      title: a.title,
      source: a.source?.name,
      publishedAt: a.publishedAt,
      description: a.description,
      url: a.url,
    }));

    cache[key] = { data: articles, fetchedAt: Date.now() };
    return articles;
  } catch (err) {
    console.error(`❌ NewsAPI error [${query}]:`, err.message);
    return [];
  }
};

module.exports = { fetchFinancialNews };
