const { generateGeminiResponse } = require("../../services/ai/geminiService");

// Known ticker patterns (3–5 uppercase letters in a query)
const TICKER_REGEX = /\b([A-Z]{2,5})\b/g;

// Keyword maps for fast routing
const KEYWORD_MAP = {
  stock_analysis: [
    "stock", "share", "ticker", "price", "analyze", "analysis",
    "chart", "bullish", "bearish", "invest in", "buy", "sell",
    "valuation", "pe ratio", "eps", "earnings", "quarterly",
  ],
  news: [
    "news", "headline", "article", "recent", "latest", "today",
    "announcement", "report", "event", "impact", "affect",
  ],
  portfolio: [
    "portfolio", "allocation", "diversify", "rebalance", "asset",
    "distribute", "invest", "holdings", "mix", "recommend",
  ],
  risk: [
    "risk", "volatile", "volatility", "safe", "danger", "overexposed",
    "drawdown", "hedge", "protect", "Loss", "exposure",
  ],
  general: [],
};

/**
 * Fast keyword-based intent detection
 * @param {string} text
 * @returns {string} intent
 */
const detectByKeywords = (text) => {
  const lower = text.toLowerCase();

  for (const [intent, keywords] of Object.entries(KEYWORD_MAP)) {
    if (intent === "general") continue;
    if (keywords.some((kw) => lower.includes(kw))) return intent;
  }
  return "general";
};

/**
 * Extract ticker symbol from text (e.g. "Analyze AAPL" → "AAPL")
 * @param {string} text
 * @returns {string|null}
 */
const extractTicker = (text) => {
  const matches = text.toUpperCase().match(TICKER_REGEX);
  // Filter out common non-ticker uppercase words
  const stopWords = new Set(["I", "A", "THE", "IS", "IN", "TO", "AND", "OR", "FOR", "ON", "AT", "IT", "MY", "ME"]);
  if (matches) {
    const ticker = matches.find((m) => !stopWords.has(m));
    return ticker || null;
  }
  return null;
};

/**
 * Main intent detector — keyword first, LLM fallback if ambiguous
 * @param {string} message
 * @param {string} contextSummary - previous context from memory agent
 * @returns {Promise<{ intent: string, ticker: string|null }>}
 */
const detectIntent = async (message, contextSummary = "") => {
  const intent = detectByKeywords(message);
  const ticker = extractTicker(message);

  // For ambiguous queries, use Gemini for classification
  if (intent === "general" && message.length > 30) {
    try {
      const classifyPrompt = `
You are a financial query classifier. Classify the following user query into EXACTLY ONE of these categories:
- stock_analysis
- news
- portfolio
- risk
- general

Previous context: "${contextSummary}"
User query: "${message}"

Reply with ONLY the category name. No explanation.`.trim();

      const llmIntent = (await generateGeminiResponse(classifyPrompt)).trim().toLowerCase();
      const validIntents = ["stock_analysis", "news", "portfolio", "risk", "general"];
      if (validIntents.includes(llmIntent)) {
        return { intent: llmIntent, ticker };
      }
    } catch {
      // Fallback to keyword result
    }
  }

  return { intent, ticker };
};

module.exports = { detectIntent, extractTicker };
