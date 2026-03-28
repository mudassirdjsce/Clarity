const { detectIntent, extractTicker } = require("../utils/chat/intentDetector");
const {
  getOrCreateSession,
  getRecentMessages,
  buildContextSummary,
  saveUserMessage,
  saveAssistantMessage,
  updateSession,
} = require("../agents/memoryAgent");

const { runStockAgent }     = require("../agents/stockAgent");
const { runNewsAgent }      = require("../agents/newsAgent");
const { runPortfolioAgent } = require("../agents/portfolioAgent");
const { runRiskAgent }      = require("../agents/riskAgent");
const { runGeneralAgent }   = require("../agents/generalAgent");

/**
 * POST /api/chat
 * Main orchestrator — receives message → routes to correct agent → returns structured response
 */
const handleChat = async (req, res) => {
  try {
    const { message, sessionId, userMode = "beginner" } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message cannot be empty." });
    }
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required." });
    }

    // ── Step 1: Memory — get session & context ────────────────────────────────
    const session = await getOrCreateSession(sessionId, userMode);
    const recentMessages = await getRecentMessages(sessionId, 6);
    const contextSummary = buildContextSummary(recentMessages, session);

    // ── Step 2: Save user message ─────────────────────────────────────────────
    await saveUserMessage(sessionId, message);

    // ── Step 3: Detect intent + ticker ───────────────────────────────────────
    const { intent, ticker: detectedTicker } = await detectIntent(message, contextSummary);

    // If no ticker in current message, fall back to last known asset from context
    const ticker = detectedTicker || session.lastAsset;

    console.log(`🧭 Intent: ${intent} | Ticker: ${ticker || "none"} | Mode: ${userMode}`);

    // ── Step 4: Route to correct agent ────────────────────────────────────────
    const agentParams = { message, ticker, contextSummary, userMode };
    let structured;

    switch (intent) {
      case "stock_analysis":
        structured = await runStockAgent(agentParams);
        break;
      case "news":
        structured = await runNewsAgent(agentParams);
        break;
      case "portfolio":
        structured = await runPortfolioAgent(agentParams);
        break;
      case "risk":
        structured = await runRiskAgent(agentParams);
        break;
      default:
        structured = await runGeneralAgent(agentParams);
    }

    // ── Step 5: Save assistant response ──────────────────────────────────────
    const summaryContent = structured.insight || "Analysis complete.";
    await saveAssistantMessage(sessionId, summaryContent, structured, intent);

    // ── Step 6: Update session metadata ──────────────────────────────────────
    await updateSession(sessionId, { ticker, intent, userMode });

    // ── Step 7: Return response ───────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      sessionId,
      userMode,
      intent,
      ticker: ticker || null,
      response: structured,
    });
  } catch (error) {
    console.error("❌ Chat controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

module.exports = { handleChat };
