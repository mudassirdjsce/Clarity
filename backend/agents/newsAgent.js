const { generateGeminiResponse } = require("../services/ai/geminiService");
const { fetchFinancialNews } = require("../services/ai/newsChatService");
const { buildNewsPrompt } = require("../utils/chat/promptBuilder");
const { parseStructuredResponse } = require("../utils/chat/responseFormatter");

/**
 * News Intelligence Agent
 * Fetches relevant news → builds impact analysis prompt → calls Gemini → structured response
 */
const runNewsAgent = async ({ message, ticker, contextSummary, userMode }) => {
  // Use ticker if available, else use the whole message as search query
  const searchQuery = ticker || message.slice(0, 60);

  const news = await fetchFinancialNews(searchQuery, 5);

  const prompt = buildNewsPrompt({
    message,
    news,
    contextSummary,
    userMode,
  });

  const rawText = await generateGeminiResponse(prompt);
  const structured = parseStructuredResponse(rawText);

  // Always mark NewsAPI as source
  if (!structured.dataSources.some((s) => s.toLowerCase().includes("news"))) {
    structured.dataSources.unshift("NewsAPI (Financial Headlines)");
  }

  return structured;
};

module.exports = { runNewsAgent };
