const { generateGeminiResponse } = require("../services/ai/geminiService");
const { getStockQuote, getCompanyProfile, getBasicFinancials } = require("../services/ai/stockService");
const { fetchFinancialNews } = require("../services/ai/newsChatService");
const { calculateStockRisk } = require("../utils/chat/riskCalculator");
const { buildStockPrompt } = require("../utils/chat/promptBuilder");
const { parseStructuredResponse } = require("../utils/chat/responseFormatter");

/**
 * Stock Analysis Agent
 * Fetches live data from Finnhub → builds prompt → calls Gemini → returns structured response
 */
const runStockAgent = async ({ message, ticker, contextSummary, userMode }) => {
  if (!ticker) {
    return {
      insight: "No ticker symbol detected.",
      riskLevel: "N/A",
      warning: "Please specify a stock symbol (e.g. AAPL, TSLA, RELIANCE).",
      dataSources: [],
      keyMetrics: {},
      explanation: "I couldn't identify a specific stock in your query.",
      reasoning: ["No ticker pattern found in the user's message."],
      suggestion: "Try: 'Analyze AAPL' or 'What's the outlook for TSLA?'",
      confidenceScore: 0,
    };
  }

  // Fetch all data in parallel
  const [quote, profile, financials, news] = await Promise.all([
    getStockQuote(ticker),
    getCompanyProfile(ticker),
    getBasicFinancials(ticker),
    fetchFinancialNews(ticker, 3),
  ]);

  // Run deterministic risk engine
  const risk = calculateStockRisk(quote, financials);

  // Build prompt
  const prompt = buildStockPrompt({
    message,
    quote,
    profile,
    financials,
    risk,
    news,
    contextSummary,
    userMode,
  });

  // Call Gemini
  const rawText = await generateGeminiResponse(prompt);

  // Parse + validate
  const structured = parseStructuredResponse(rawText);

  // Enrich data sources
  if (!structured.dataSources.includes("Finnhub")) {
    structured.dataSources.unshift("Finnhub (Live Stock Data)");
  }
  if (news.length > 0 && !structured.dataSources.includes("NewsAPI")) {
    structured.dataSources.push("NewsAPI (Recent Headlines)");
  }

  return structured;
};

module.exports = { runStockAgent };
