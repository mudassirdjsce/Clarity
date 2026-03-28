const cron = require("node-cron");
const { generateInsights } = require("../services/insights/insightEngine");

const startInsightsCron = () => {
  cron.schedule("*/15 * * * *", async () => {
    console.log("Running Insights Cron...");
    await generateInsights();
  });
};

module.exports = startInsightsCron;