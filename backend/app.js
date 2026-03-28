require("dotenv").config();
const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/news", newsRoutes);
app.use("/api/insights", insightsRoutes);

// ── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;