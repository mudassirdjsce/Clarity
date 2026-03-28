const KEYWORDS = [
  "earnings", "inflation", "interest rate",
  "rbi", "fed", "merger", "acquisition", "market crash"
];

const isRelevant = (article) => {
  const text = `${article.title} ${article.description || ""}`.toLowerCase();
  return KEYWORDS.some(k => text.includes(k));
};

module.exports = { isRelevant };