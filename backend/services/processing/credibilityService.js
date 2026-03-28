const SOURCE_SCORE = {
  Reuters: 95,
  Bloomberg: 95,
  CNBC: 85
};

const getSourceScore = (source) => SOURCE_SCORE[source] || 60;

const getRecencyScore = (date) => {
  const hours = (Date.now() - new Date(date)) / (1000 * 60 * 60);
  if (hours < 2) return 100;
  if (hours < 12) return 80;
  if (hours < 24) return 60;
  return 40;
};

const calculateCredibility = (article, similarCount) => {
  const source = getSourceScore(article.source);
  const recency = getRecencyScore(article.publishedAt);
  const cross = Math.min(similarCount * 10, 100);

  return Math.round(source * 0.4 + recency * 0.3 + cross * 0.3);
};

module.exports = { calculateCredibility };