const News = require("../../models/News");
const Insight = require("../../models/Insight");
const { analyzeMarket } = require("./marketAnalyzer");

const generateInsights = async () => {
  const news = await News.find().sort({ publishedAt: -1 }).limit(100);

  if (!news.length) return;

  const data = analyzeMarket(news);

  await Insight.create({
    type: "market_summary",
    title: "Market Overview",
    insight: data.summary,
    sentiment: data.sentiment,
    impact: data.impact,
    confidence: data.confidence,
    basedOn: news.length
  });

  console.log("Insights generated");
};

module.exports = { generateInsights };