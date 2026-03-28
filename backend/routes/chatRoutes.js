const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");

// POST /api/chat
// Body: { message: string, sessionId: string, userMode: "beginner" | "pro" }
router.post("/", handleChat);

module.exports = router;
