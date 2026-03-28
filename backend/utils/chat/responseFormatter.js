/**
 * Response Formatter
 * Parses raw Gemini text output → validated structured response object
 */

const DEFAULT_RESPONSE = {
  insight: "Analysis complete.",
  riskLevel: "Medium",
  warning: null,
  dataSources: [],
  keyMetrics: {},
  explanation: "Unable to generate detailed analysis at this time.",
  reasoning: ["Data was processed but response parsing encountered an issue."],
  suggestion: "Please try rephrasing your question.",
  confidenceScore: 10,
};

/**
 * Parse and validate Gemini's raw text response into the 9-point structured format
 * @param {string} rawText - Raw text from Gemini
 * @returns {object} Validated structured response
 */
const parseStructuredResponse = (rawText) => {
  try {
    // Strip any markdown code fences if Gemini added them
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    const parsed = JSON.parse(cleaned);

    // Validate required fields and apply defaults
    return {
      insight:         parsed.insight         || DEFAULT_RESPONSE.insight,
      riskLevel:       ["Low", "Medium", "High"].includes(parsed.riskLevel)
                         ? parsed.riskLevel : DEFAULT_RESPONSE.riskLevel,
      warning:         parsed.warning         || null,
      dataSources:     Array.isArray(parsed.dataSources) ? parsed.dataSources : [],
      keyMetrics:      typeof parsed.keyMetrics === "object" ? parsed.keyMetrics : {},
      explanation:     parsed.explanation     || DEFAULT_RESPONSE.explanation,
      reasoning:       Array.isArray(parsed.reasoning) ? parsed.reasoning : DEFAULT_RESPONSE.reasoning,
      suggestion:      parsed.suggestion      || DEFAULT_RESPONSE.suggestion,
      confidenceScore: typeof parsed.confidenceScore === "number"
                         ? Math.min(100, Math.max(0, parsed.confidenceScore))
                         : DEFAULT_RESPONSE.confidenceScore,
    };
  } catch (err) {
    console.error("❌ Response formatter parse error:", err.message);
    console.error("Raw text received:", rawText?.slice(0, 300));
    return { ...DEFAULT_RESPONSE };
  }
};

module.exports = { parseStructuredResponse };
