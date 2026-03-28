const { generateGeminiResponse } = require("../services/ai/geminiService");
const { buildGeneralPrompt } = require("../utils/chat/promptBuilder");
const { parseStructuredResponse } = require("../utils/chat/responseFormatter");

/**
 * General Agent
 * Handles broad financial questions that don't need live data
 */
const runGeneralAgent = async ({ message, contextSummary, userMode }) => {
  const prompt = buildGeneralPrompt({ message, contextSummary, userMode });
  const rawText = await generateGeminiResponse(prompt);
  const structured = parseStructuredResponse(rawText);

  structured.dataSources = ["Gemini AI (Financial Knowledge Base)", ...structured.dataSources];
  return structured;
};

module.exports = { runGeneralAgent };
