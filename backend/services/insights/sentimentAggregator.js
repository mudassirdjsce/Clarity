const aggregateSentiment = (newsList) => {
  let counts = { bullish: 0, bearish: 0, neutral: 0 };

  newsList.forEach(n => counts[n.sentiment]++);

  return counts;
};

module.exports = { aggregateSentiment };