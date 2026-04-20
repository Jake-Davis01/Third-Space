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

  const topThreeInterests = Array.isArray(insights?.topThreeInterests)
    ? insights.topThreeInterests
    : [];

  const topLocations = Array.isArray(insights?.topLocations)
    ? insights.topLocations
    : [];

  const categoryBestLocations = Array.isArray(insights?.categoryBestLocations)
    ? insights.categoryBestLocations
    : [];

  const underusedCategories = Array.isArray(insights?.underusedCategories)
    ? insights.underusedCategories
    : [];

  const defaultLocation = topLocations[0]?.location || "Fully remote";

  const bestLocationForCategory = (categoryName) => {
    const match = categoryBestLocations.find(
      (item) =>
        item.category_name &&
        item.category_name.toLowerCase() === categoryName.toLowerCase()
    );

    return match?.best_location || defaultLocation;
  };

  const exactTopThree = topThreeInterests.slice(0, 3).map((interest) => ({
    category_name: interest.category_name,
    interested_count: Number(interest.interested_users) || 0,
    best_location: bestLocationForCategory(interest.category_name),
  }));

  const nicheCategory = underusedCategories.find(
    (item) =>
      !exactTopThree.some(
        (top) =>
          top.category_name.toLowerCase() === item.category_name.toLowerCase()
      )
  );

  const prompt = `
You are helping generate workplace social event suggestions.

Use ONLY the database data below.
Do NOT claim to have searched the web.
Do NOT invent categories.
Do NOT change the ranking.
Do NOT swap in different interests.
Do NOT choose your own top interests.

The topSuggestions MUST use these exact categories in this exact order:
${JSON.stringify(exactTopThree, null, 2)}

The niche suggestion should use this category if available:
${JSON.stringify(
  nicheCategory
    ? {
        category_name: nicheCategory.category_name,
        interested_count: Number(nicheCategory.interested_users) || 0,
        best_location: defaultLocation,
      }
    : null,
  null,
  2
)}

Return VALID JSON ONLY.
Do not wrap it in markdown.
Do not include explanation outside the JSON.

Return this exact shape:
{
  "topSuggestions": [
    {
      "title": "string",
      "description": "string",
      "estimated_cost": "string",
      "best_location": "string",
      "category_name": "string",
      "categories": ["string"],
      "interested_count": 0
    },
    {
      "title": "string",
      "description": "string",
      "estimated_cost": "string",
      "best_location": "string",
      "category_name": "string",
      "categories": ["string"],
      "interested_count": 0
    },
    {
      "title": "string",
      "description": "string",
      "estimated_cost": "string",
      "best_location": "string",
      "category_name": "string",
      "categories": ["string"],
      "interested_count": 0
    }
  ],
  "nicheSuggestion": {
    "title": "string",
    "description": "string",
    "estimated_cost": "string",
    "best_location": "string",
    "category_name": "string",
    "categories": ["string"],
    "interested_count": 0
  }
}

Rules:
- topSuggestions[0].category_name must equal exactTopThree[0].category_name
- topSuggestions[1].category_name must equal exactTopThree[1].category_name
- topSuggestions[2].category_name must equal exactTopThree[2].category_name
- each topSuggestions interested_count must exactly match the provided interested_count
- each topSuggestions best_location must exactly match the provided best_location
- categories should be an array containing the same category_name
- titles should be event-style titles based on the category_name
- descriptions should be short and engaging, but still relevant to the category
- estimated_cost should be a rough label like "Low", "Low to medium", or "Medium"
- if no niche category is provided, set nicheSuggestion to null

DATABASE CONTEXT:
${JSON.stringify(
  {
    exactTopThree,
    nicheCategory,
    topLocations,
  },
  null,
  2
)}
`;

  try {
    const response = await callGeminiWithRetry({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const rawText =
      typeof response.text === "function" ? response.text() : response.text || "";

    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const lockedTopSuggestions = exactTopThree.map((interest, index) => {
      const aiSuggestion = Array.isArray(parsed.topSuggestions)
        ? parsed.topSuggestions[index] || {}
        : {};

      return {
        title:
          aiSuggestion.title ||
          `${interest.category_name} Social`,
        description:
          aiSuggestion.description ||
          `${interest.category_name} is one of the most popular interests in your database based on unique users, making it a strong choice for a new event.`,
        estimated_cost:
          aiSuggestion.estimated_cost || "Low to medium",
        best_location: interest.best_location,
        category_name: interest.category_name,
        categories: [interest.category_name],
        interested_count: interest.interested_count,
      };
    });

    let lockedNicheSuggestion = null;

    if (nicheCategory) {
      const aiNiche = parsed.nicheSuggestion || {};

      lockedNicheSuggestion = {
        title: aiNiche.title || `${nicheCategory.category_name} Meetup`,
        description:
          aiNiche.description ||
          `${nicheCategory.category_name} has interested users but very few existing events, so it could be a strong niche option to try.`,
        estimated_cost: aiNiche.estimated_cost || "Low",
        best_location: aiNiche.best_location || defaultLocation,
        category_name: nicheCategory.category_name,
        categories: [nicheCategory.category_name],
        interested_count: Number(nicheCategory.interested_users) || 0,
      };
    }

    return {
      topSuggestions: lockedTopSuggestions,
      nicheSuggestion: lockedNicheSuggestion,
    };
  } catch (err) {
    console.error("Gemini suggestion fallback triggered:", err.message);

    const topSuggestions = exactTopThree.map((interest) => ({
      title: `${interest.category_name} Social`,
      description: `${interest.category_name} is one of the most popular interests in your database based on unique users, making it a strong choice for a new event.`,
      estimated_cost: "Low to medium",
      best_location: interest.best_location,
      category_name: interest.category_name,
      categories: [interest.category_name],
      interested_count: interest.interested_count,
    }));

    const nicheSuggestion = nicheCategory
      ? {
          title: `${nicheCategory.category_name} Meetup`,
          description: `${nicheCategory.category_name} has interested users but very few existing events, so it could be a strong niche option to try.`,
          estimated_cost: "Low",
          best_location: defaultLocation,
          category_name: nicheCategory.category_name,
          categories: [nicheCategory.category_name],
          interested_count: Number(nicheCategory.interested_users) || 0,
        }
      : null;

    return {
      topSuggestions,
      nicheSuggestion,
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

If interestStats exists, mention the interested user count in the description.
Interest popularity is based on unique users only.

DATABASE INSIGHTS:
${JSON.stringify(ideaInsights, null, 2)}
`;

  try {
    const response = await callGeminiWithRetry({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return {
      rawText:
        typeof response.text === "function" ? response.text() : response.text,
    };
  } catch (err) {
    console.error("Gemini validation fallback triggered:", err.message);

    const matchedCategory = ideaInsights?.matchedCategory || "";
    const interestedUsers = Number(
      ideaInsights?.interestStats?.interested_users || 0
    );
    const categories = matchedCategory ? [matchedCategory] : [];

    return {
      title: ideaInsights?.userIdea || "Suggested Event Idea",
      description: matchedCategory
        ? `This idea appears relevant because it matches the "${matchedCategory}" category in your database and currently has ${interestedUsers} interested member${
            interestedUsers === 1 ? "" : "s"
          }.`
        : "This idea could not be fully assessed from the current database data.",
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