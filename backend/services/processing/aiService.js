const axios = require("axios");

const analyzeNews = async (article) => {
  try {
    const prompt = `
Return JSON only:
{
 "summary": "",
 "sentiment": "bullish|bearish|neutral",
 "impact": "high|medium|low"
}
News: ${article.title} ${article.description}
`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const text = res.data.candidates[0].content.parts[0].text;
    return JSON.parse(text);

  } catch (err) {
    return {
      summary: article.title,
      sentiment: "neutral",
      impact: "low"
    };
  }
};

module.exports = { analyzeNews };