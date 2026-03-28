const deduplicate = (articles) => {
  const seen = new Set();
  return articles.filter(a => {
    if (seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });
};

module.exports = { deduplicate };