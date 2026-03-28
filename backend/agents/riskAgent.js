const { generateGeminiResponse } = require("../services/ai/geminiService");
const { getStockQuote, getBasicFinancials } = require("../services/ai/stockService");
const { calculateStockRisk, checkPortfolioExposure } = require("../utils/chat/riskCalculator");
const { parseStructuredResponse } = require("../utils/chat/responseFormatter");

/**
 * Risk Agent
 * Runs the deterministic risk engine + uses Gemini for contextual risk explanation
 */
const runRiskAgent = async ({ message, ticker, contextSummary, userMode }) => {
  let quote = null;
  let financials = {};
  let risk = { riskLevel: "Medium", warning: null, metrics: {} };

  if (ticker) {
    [quote, financials] = await Promise.all([
      getStockQuote(ticker),
      getBasicFinancials(ticker),
    ]);
    risk = calculateStockRisk(quote, financials);
  }

  const modeInstruction = userMode === "pro"
    ? "Use precise financial risk terminology."
    : "Explain risk in simple terms a beginner can understand.";

  const prompt = `
You are Clarity, an AI risk analyst.
User mode: ${userMode.toUpperCase()} — ${modeInstruction}

Context: "${contextSummary || "First message"}"
User query: "${message}"
${ticker ? `Asset being analyzed: ${ticker}` : ""}

RISK ENGINE RESULTS:
Risk Level: ${risk.riskLevel}
Warning: ${risk.warning || "None"}
Metrics: ${JSON.stringify(risk.metrics)}
${quote ? `Live Price: $${quote.c} | Daily Change: ${quote.dp?.toFixed(2)}%` : ""}

Based on these deterministic risk calculations, provide a complete risk assessment.

You MUST respond with ONLY a valid JSON object. No markdown, no code blocks.
{
  "insight": "string",
  "riskLevel": "Low | Medium | High",
  "warning": "string or null",
  "dataSources": ["array"],
  "keyMetrics": {},
  "explanation": "string",
  "reasoning": ["array"],
  "suggestion": "string",
  "confidenceScore": number
}`.trim();

  const rawText = await generateGeminiResponse(prompt);
  const structured = parseStructuredResponse(rawText);

  // Override risk level with deterministic engine result (more reliable than LLM)
  structured.riskLevel = risk.riskLevel;
  if (risk.warning) structured.warning = risk.warning;
  structured.dataSources = ["Rule-Based Risk Engine", ...(ticker ? ["Finnhub (Live Data)"] : []), ...structured.dataSources];

  return structured;
};

module.exports = { runRiskAgent };
