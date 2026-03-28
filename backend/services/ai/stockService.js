const axios = require("axios");

const FINNHUB_BASE = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY?.trim();

// Simple in-memory cache: { symbol_type: { data, fetchedAt } }
const cache = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const isCached = (key) =>
  cache[key] && Date.now() - cache[key].fetchedAt < CACHE_TTL_MS;

/**
 * Fetch real-time quote for a ticker symbol
 */
const getStockQuote = async (symbol) => {
  const key = `quote_${symbol}`;
  if (isCached(key)) return cache[key].data;

  try {
    const { data } = await axios.get(`${FINNHUB_BASE}/quote`, {
      params: { symbol: symbol.toUpperCase(), token: API_KEY },
    });
    cache[key] = { data, fetchedAt: Date.now() };
    return data;
    // Returns: { c: current, d: change, dp: changePercent, h: high, l: low, o: open, pc: prevClose }
  } catch (err) {
    console.error(`❌ Finnhub quote error [${symbol}]:`, err.message);
    return null;
  }
};

/**
 * Fetch company profile (name, sector, industry)
 */
const getCompanyProfile = async (symbol) => {
  const key = `profile_${symbol}`;
  if (isCached(key)) return cache[key].data;

  try {
    const { data } = await axios.get(`${FINNHUB_BASE}/stock/profile2`, {
      params: { symbol: symbol.toUpperCase(), token: API_KEY },
    });
    cache[key] = { data, fetchedAt: Date.now() };
    return data;
  } catch (err) {
    console.error(`❌ Finnhub profile error [${symbol}]:`, err.message);
    return null;
  }
};

/**
 * Fetch basic financials / key metrics
 */
const getBasicFinancials = async (symbol) => {
  const key = `financials_${symbol}`;
  if (isCached(key)) return cache[key].data;

  try {
    const { data } = await axios.get(`${FINNHUB_BASE}/stock/metric`, {
      params: { symbol: symbol.toUpperCase(), metric: "all", token: API_KEY },
    });
    cache[key] = { data, fetchedAt: Date.now() };
    return data?.metric || {};
  } catch (err) {
    console.error(`❌ Finnhub financials error [${symbol}]:`, err.message);
    return {};
  }
};

module.exports = { getStockQuote, getCompanyProfile, getBasicFinancials };
