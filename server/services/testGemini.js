const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { GoogleGenAI } = require("@google/genai");

console.log("Loaded GEMINI_API_KEY:", !!process.env.GEMINI_API_KEY);
console.log("Env file path:", path.join(__dirname, "../../.env"));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from the root .env file");
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "Suggest one simple team social event idea in one sentence.",
    });

    console.log("\nGemini is working");
    console.log("Response:", response.text);
  } catch (err) {
    console.error("\nGemini test failed");
    console.error("Error message:", err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  }
}

testGemini();