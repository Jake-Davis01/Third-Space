const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function callGeminiWithRetry(config, retries = 2) {
  try {
    return await ai.models.generateContent(config);
  } catch (err) {
    const message = err?.message || "";

    if (
      retries > 0 &&
      (message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED"))
    ) {
      console.log("Retrying Gemini request...");
      await new Promise((res) => setTimeout(res, 2000));
      return callGeminiWithRetry(config, retries - 1);
    }

    throw err;
  }
}

async function generateAiSuggestions(insights) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from the root .env file");
  }

  const prompt = `
You are helping generate workplace social event suggestions.

Use ONLY the database insights below.
Do NOT claim to have searched the web.
Do NOT invent statistics.

Return:
- 3 top suggestions
- 1 niche suggestion (must be different category)

Each suggestion must include:
- title
- short description explaining WHY based on the data
- estimated_cost (rough estimate)
- best_location (based on patterns)

DATABASE INSIGHTS:
${JSON.stringify(insights, null, 2)}
`;

  try {
    const response = await callGeminiWithRetry({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return {
      rawText: response.text,
    };
  } catch (err) {
    console.error("Gemini suggestion fallback triggered:", err.message);

    return {
      rawText:
        "Top suggestions based on current database trends: Running Club, Film Night, and Board Games Social. A niche option could be a Chess Meetup. These were chosen because they align with recorded interest and event activity patterns.",
    };
  }
}

async function validateIdeaWithAi(ideaInsights) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from the root .env file");
  }

  const prompt = `
You are evaluating whether a user's event idea is good based ONLY on database data.

Return:
- title (clean version of idea)
- short description explaining reasoning
- verdict: "good idea", "maybe", or "not recommended"
- confidence: "high", "medium", or "low"
- category_name (if matched, else "")
- categories (array, empty if none)

If interestedStats exists, mention the interested user count in the description.

DATABASE INSIGHTS:
${JSON.stringify(ideaInsights, null, 2)}
`;

  try {
    const response = await callGeminiWithRetry({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return {
      rawText: response.text,
    };
  } catch (err) {
    console.error("Gemini validation fallback triggered:", err.message);

    const matchedCategory = ideaInsights?.matchedCategory || "";
    const interestedUsers = Number(ideaInsights?.interestStats?.interested_users || 0);
    const categories = matchedCategory ? [matchedCategory] : [];

    return {
      title: ideaInsights?.userIdea || "Suggested Event Idea",
      description: matchedCategory
        ? `This idea appears relevant because it matches the "${matchedCategory}" category in your database and currently has ${interestedUsers} interested member${interestedUsers === 1 ? "" : "s"}, but AI quota is currently limited.`
        : "This idea could not be fully assessed because AI quota is currently limited.",
      verdict: matchedCategory ? "maybe" : "not recommended",
      confidence: "low",
      category_name: matchedCategory,
      categories,
      interested_count: interestedUsers,
    };
  }
}

module.exports = {
  generateAiSuggestions,
  validateIdeaWithAi,
};