const { generateGeminiResponse } = require("../services/ai/geminiService");
const { buildPortfolioPrompt } = require("../utils/chat/promptBuilder");
const { parseStructuredResponse } = require("../utils/chat/responseFormatter");

// Simple heuristics to infer risk tolerance from message
const inferRiskTolerance = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes("safe") || lower.includes("conservative") || lower.includes("low risk")) return "low";
  if (lower.includes("aggressive") || lower.includes("high risk") || lower.includes("growth")) return "high";
  return "moderate";
};

// Simple heuristics to infer investment goal
const inferGoal = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes("retire") || lower.includes("retirement")) return "retirement planning";
  if (lower.includes("short") || lower.includes("quick"))        return "short-term gains";
  if (lower.includes("dividend") || lower.includes("income"))    return "passive income";
  return "long-term wealth growth";
};

/**
 * Portfolio Agent
 * Infers risk/goal from user message → builds allocation prompt → calls Gemini
 */
const runPortfolioAgent = async ({ message, contextSummary, userMode }) => {
  const riskTolerance = inferRiskTolerance(message);
  const goal = inferGoal(message);

  const prompt = buildPortfolioPrompt({
    message,
    riskTolerance,
    goal,
    contextSummary,
    userMode,
  });

  const rawText = await generateGeminiResponse(prompt);
  const structured = parseStructuredResponse(rawText);

  // Enrich
  structured.dataSources = ["Gemini AI Analysis", "Modern Portfolio Theory", ...structured.dataSources];
  if (!structured.keyMetrics["riskTolerance"]) {
    structured.keyMetrics["riskTolerance"] = riskTolerance;
    structured.keyMetrics["investmentGoal"] = goal;
  }

  return structured;
};

module.exports = { runPortfolioAgent };
