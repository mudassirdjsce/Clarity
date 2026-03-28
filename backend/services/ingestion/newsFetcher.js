const axios = require("axios");

const fetchFinnhub = async () => {
  const res = await axios.get(
    `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
  );
  return res.data;
};

const fetchNewsAPI = async () => {
  const res = await axios.get(
    `https://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.NEWS_API_KEY}`
  );
  return res.data.articles;
};

module.exports = { fetchFinnhub, fetchNewsAPI };