import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "http://localhost:5000/api";

// Get or create a session ID per browser tab (stored in sessionStorage)
export const getSessionId = () => {
  let sid = sessionStorage.getItem("clarity_session_id");
  if (!sid) {
    sid = uuidv4();
    sessionStorage.setItem("clarity_session_id", sid);
  }
  return sid;
};

/**
 * Send a chat message to the backend
 * @param {string} message
 * @param {string} userMode - "beginner" | "pro"
 * @returns {Promise<object>} - Full structured response
 */
export const sendChatMessage = async (message, userMode = "beginner") => {
  const sessionId = getSessionId();
  const { data } = await axios.post(`${API_BASE}/chat`, {
    message,
    sessionId,
    userMode,
  });
  return data;
};

/**
 * Fetch chat history for current session
 */
export const fetchChatHistory = async () => {
  const sessionId = getSessionId();
  const { data } = await axios.get(`${API_BASE}/history/${sessionId}`);
  return data;
};
