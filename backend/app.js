require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes     = require("./routes/authRoutes");
const newsRoutes     = require("./routes/newsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const ttsRoutes      = require("./routes/tts");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// ── Health check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: { stocks: "Finnhub", news: "NewsAPI" },
  });
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/news",     newsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/tts",      ttsRoutes);

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