require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const newsRoutes = require("./routes/newsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const chatRoutes = require("./routes/chatRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// ── Health check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: { llm: "Gemini 1.5 Flash", stocks: "Finnhub", news: "NewsAPI" },
  });
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/news", newsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

module.exports = app;