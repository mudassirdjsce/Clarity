const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Send a prompt to Gemini and get a text response.
 * @param {string} prompt - The full structured prompt
 * @returns {Promise<string>} - Raw text from Gemini
 */
const generateGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    throw new Error("Gemini API failed: " + error.message);
  }
};

module.exports = { generateGeminiResponse };
