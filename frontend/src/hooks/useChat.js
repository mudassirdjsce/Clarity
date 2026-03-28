import { useState, useCallback, useRef } from "react";
import { sendChatMessage } from "../services/chatApi";

const useChat = (defaultMode = "beginner") => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(defaultMode);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const sendMessage = useCallback(
    async (text) => {
      if (!text?.trim()) return;

      const userMsg = {
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const data = await sendChatMessage(text, mode);

        const assistantMsg = {
          role: "assistant",
          content: data.response?.insight || "Analysis complete.",
          structured: data.response,
          intent: data.intent,
          ticker: data.ticker,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setTimeout(scrollToBottom, 50);
      } catch (err) {
        setError("Failed to get a response. Please check the backend.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I encountered an error. Please try again.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [mode]
  );

  return { messages, isLoading, error, mode, setMode, sendMessage, scrollRef };
};

export default useChat;
