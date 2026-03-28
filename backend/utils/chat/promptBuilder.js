/**
 * Prompt Builder — constructs the structured Gemini prompt for each agent
 * Injects: user message + context + live data + user mode + output format instructions
 */

const OUTPUT_INSTRUCTIONS = `
You MUST respond with ONLY a valid JSON object. No markdown, no code blocks, no explanation outside the JSON.
The JSON must follow this EXACT schema:
{
  "insight": "string — 1 sentence high-level conclusion (Bullish/Bearish/Neutral with reasoning)",
  "riskLevel": "Low | Medium | High",
  "warning": "string or null — specific risk warning if any",
  "dataSources": ["array of strings — e.g. Finnhub, NewsAPI, Market Indicators"],
  "keyMetrics": {
    "any key": "any value — include relevant numbers like price change, volatility, beta etc"
  },
  "explanation": "string — 2-4 sentences explaining WHY this conclusion was reached",
  "reasoning": ["array of strings — step-by-step decision logic, 2-4 steps"],
  "suggestion": "string — 1-2 sentence actionable guidance for the user",
  "confidenceScore": number between 0 and 100
}`;

/**
 * Build prompt for stock analysis agent
 */
const buildStockPrompt = ({ message, quote, profile, financials, risk, news, contextSummary, userMode }) => {
  const modeInstruction = userMode === "pro"
    ? "Use precise financial terminology, reference specific metrics, and provide institutional-grade analysis."
    : "Use simple, jargon-free language. Explain terms as if speaking to a beginner investor.";

  return `
You are Clarity, an elite AI financial analyst assistant.
User mode: ${userMode.toUpperCase()} — ${modeInstruction}

Conversation context: "${contextSummary || "First message"}"
User query: "${message}"

LIVE STOCK DATA:
${profile ? `Company: ${profile.name} | Sector: ${profile.finnhubIndustry} | Country: ${profile.country}` : "Profile: N/A"}
${quote ? `Price: $${quote.c} | Change: ${quote.dp?.toFixed(2)}% | High: $${quote.h} | Low: $${quote.l} | Prev Close: $${quote.pc}` : "Quote: N/A"}
${financials && Object.keys(financials).length > 0
  ? `Beta: ${financials.beta || "N/A"} | PE Ratio: ${financials.peNormalizedAnnual || "N/A"} | 52W High: ${financials["52WeekHigh"] || "N/A"} | 52W Low: ${financials["52WeekLow"] || "N/A"}`
  : "Financials: N/A"}

RISK ENGINE OUTPUT:
Risk Level: ${risk.riskLevel}
Warning: ${risk.warning || "None"}
Metrics: ${JSON.stringify(risk.metrics)}

RECENT NEWS HEADLINES (for context):
${news && news.length > 0
  ? news.slice(0, 3).map((n, i) => `${i + 1}. ${n.title} (${n.source})`).join("\n")
  : "No recent news available"}

${OUTPUT_INSTRUCTIONS}`.trim();
};

/**
 * Build prompt for news intelligence agent
 */
const buildNewsPrompt = ({ message, news, contextSummary, userMode }) => {
  const modeInstruction = userMode === "pro"
    ? "Use financial market terminology, macro analysis, and sector-level impact assessment."
    : "Explain news impact in simple terms a new investor would understand.";

  const newsText = news && news.length > 0
    ? news.map((n, i) => `${i + 1}. ${n.title}\nSource: ${n.source} | Date: ${n.publishedAt}\nSummary: ${n.description || "N/A"}`).join("\n\n")
    : "No news articles found for this topic.";

  return `
You are Clarity, an elite AI financial news analyst.
User mode: ${userMode.toUpperCase()} — ${modeInstruction}

Conversation context: "${contextSummary || "First message"}"
User query: "${message}"

RECENT NEWS ARTICLES:
${newsText}

Based on these articles, analyze the market/sector/asset impact.
${OUTPUT_INSTRUCTIONS}`.trim();
};

/**
 * Build prompt for portfolio agent
 */
const buildPortfolioPrompt = ({ message, riskTolerance, goal, contextSummary, userMode }) => {
  const modeInstruction = userMode === "pro"
    ? "Provide institutional-level asset allocation strategy with specific ETF/sector recommendations."
    : "Suggest a simple, easy-to-understand portfolio allocation for a beginner.";

  return `
You are Clarity, an elite AI portfolio strategist.
User mode: ${userMode.toUpperCase()} — ${modeInstruction}

Conversation context: "${contextSummary || "First message"}"
User query: "${message}"
Detected risk tolerance: ${riskTolerance || "moderate"}
Detected investment goal: ${goal || "wealth growth"}

Suggest an optimal portfolio allocation. Be specific with percentages.
${OUTPUT_INSTRUCTIONS}`.trim();
};

/**
 * Build prompt for general finance agent
 */
const buildGeneralPrompt = ({ message, contextSummary, userMode }) => {
  const modeInstruction = userMode === "pro"
    ? "Answer with precision, using financial terminology and detailed analysis."
    : "Answer clearly and simply, as if explaining to someone new to investing.";

  return `
You are Clarity, an elite AI financial assistant.
User mode: ${userMode.toUpperCase()} — ${modeInstruction}

Conversation context: "${contextSummary || "First message"}"
User query: "${message}"

${OUTPUT_INSTRUCTIONS}`.trim();
};

module.exports = { buildStockPrompt, buildNewsPrompt, buildPortfolioPrompt, buildGeneralPrompt };
