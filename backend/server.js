const startNewsCron = require("./cron/newsCron");
const startInsightsCron = require("./cron/insightsCron");

startNewsCron();
startInsightsCron();