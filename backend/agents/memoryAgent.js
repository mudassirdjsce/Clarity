const Chat = require("../models/Chat");
const Message = require("../models/Message");

/**
 * Get or create a chat session
 */
const getOrCreateSession = async (sessionId, userMode = "beginner") => {
  let session = await Chat.findOne({ sessionId });
  if (!session) {
    session = await Chat.create({ sessionId, userMode });
  }
  return session;
};

/**
 * Fetch recent messages for context (last 6)
 */
const getRecentMessages = async (sessionId, limit = 6) => {
  const messages = await Message.find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return messages.reverse(); // chronological order
};

/**
 * Build a short context summary from recent messages
 */
const buildContextSummary = (recentMessages, session) => {
  if (!recentMessages || recentMessages.length === 0) return "";

  const history = recentMessages
    .map((m) => `${m.role === "user" ? "User" : "Clarity"}: ${m.content.slice(0, 120)}`)
    .join("\n");

  const assetContext = session.lastAsset ? `Last discussed asset: ${session.lastAsset}.` : "";
  const topicContext = session.lastTopic  ? `Last topic: ${session.lastTopic}.` : "";

  return `${assetContext} ${topicContext}\nRecent conversation:\n${history}`.trim();
};

/**
 * Save user message to MongoDB
 */
const saveUserMessage = async (sessionId, content) => {
  await Message.create({ sessionId, role: "user", content });
};

/**
 * Save assistant response to MongoDB
 */
const saveAssistantMessage = async (sessionId, content, structured, intent) => {
  await Message.create({
    sessionId,
    role: "assistant",
    content,
    structured,
    intent,
  });
};

/**
 * Update session metadata (lastAsset, lastTopic, messageCount)
 */
const updateSession = async (sessionId, { ticker, intent, userMode }) => {
  const update = { $inc: { messageCount: 1 } };
  if (ticker) update.$set = { ...(update.$set || {}), lastAsset: ticker };
  if (intent) update.$set = { ...(update.$set || {}), lastTopic: intent };
  if (userMode) update.$set = { ...(update.$set || {}), userMode };
  await Chat.findOneAndUpdate({ sessionId }, update);
};

module.exports = {
  getOrCreateSession,
  getRecentMessages,
  buildContextSummary,
  saveUserMessage,
  saveAssistantMessage,
  updateSession,
};
