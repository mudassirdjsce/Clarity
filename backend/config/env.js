require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY
};