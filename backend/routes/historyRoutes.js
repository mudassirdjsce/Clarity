const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");

// GET /api/history/:sessionId
// Returns session metadata + full message history
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const session = await Chat.findOne({ sessionId }).lean();
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      session: {
        sessionId: session.sessionId,
        userMode: session.userMode,
        lastAsset: session.lastAsset,
        lastTopic: session.lastTopic,
        messageCount: session.messageCount,
        createdAt: session.createdAt,
      },
      messages,
    });
  } catch (error) {
    console.error("❌ History route error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch history." });
  }
});

module.exports = router;
