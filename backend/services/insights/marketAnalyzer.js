const analyzeMarket = (newsList) => {
  let bullish = 0, bearish = 0, neutral = 0;

  newsList.forEach(n => {
    if (n.sentiment === "bullish") bullish++;
    else if (n.sentiment === "bearish") bearish++;
    else neutral++;
  });

  let sentiment = "neutral";

  if (bullish > bearish) sentiment = "bullish";
  else if (bearish > bullish) sentiment = "bearish";

  const impactCount = newsList.filter(n => n.impact === "high").length;

  const impact =
    impactCount > 10 ? "high" :
    impactCount > 5 ? "medium" : "low";

  return {
    summary: `Market is ${sentiment} with ${impact} impact driven by recent events.`,
    sentiment,
    impact,
    confidence: Math.min((impactCount / newsList.length) * 100, 100)
  };
};

module.exports = { analyzeMarket };