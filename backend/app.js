const express = require("express");
const newsRoutes = require("./routes/newsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");

const app = express();

app.use(express.json());

app.use("/api/news", newsRoutes);
app.use("/api/insights", insightsRoutes);

module.exports = app;