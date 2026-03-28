const normalizeFinnhub = (data) => {
  return data.map(item => ({
    title: item.headline,
    description: item.summary,
    source: item.source,
    publishedAt: item.datetime * 1000
  }));
};

const normalizeNewsAPI = (data) => {
  return data.map(item => ({
    title: item.title,
    description: item.description,
    source: item.source.name,
    publishedAt: item.publishedAt
  }));
};

module.exports = { normalizeFinnhub, normalizeNewsAPI };