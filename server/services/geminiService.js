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

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function pickRandom(items = []) {
  if (!Array.isArray(items) || items.length === 0) return "";
  return items[Math.floor(Math.random() * items.length)];
}

function buildNoMatchMessage(userIdea = "") {
  const ideas = [
    `This idea is a creative one, but it does not currently line up closely with the interests that are showing clear traction in your database. It may still be worth revisiting later, though right now there is not enough support behind it to recommend it confidently.`,
    `There is not a strong database match for this idea at the moment, so it feels a little harder to back with confidence. A version of it tied more closely to an existing interest area would probably have a better chance of landing well.`,
    `This suggestion feels a bit outside the themes people are currently showing the clearest interest in. That does not make it a bad idea, but based on the current data it looks like a riskier choice than options with stronger member interest behind them.`,
    `Right now, this idea does not connect strongly to the interests already showing momentum in your data. It could still work with the right audience, but it is not one of the more naturally supported options at the moment.`,
    `This idea has a nice concept behind it, but the current database does not show enough relevant interest to make it feel like a strong recommendation yet. You may get a better result by reshaping it around an interest area members already engage with.`,
  ];

  return pickRandom(ideas);
}

function buildSmallGroupMessage(categoryName, interestedUsers) {
  const messages = [
    `This idea matches "${categoryName}" and currently has ${interestedUsers} interested member${
      interestedUsers === 1 ? "" : "s"
    }. That is still a fairly small pool, so it may not be the strongest choice if you are hoping for broad turnout, but if you are aiming for a smaller and more focused group, it could still work nicely.`,
    `This idea fits "${categoryName}" and there are currently ${interestedUsers} interested member${
      interestedUsers === 1 ? "" : "s"
    }. The audience is on the smaller side, so it is worth keeping expectations realistic, though for a niche or close-knit group activity it could still be a good option.`,
    `This connects well to "${categoryName}", with ${interestedUsers} interested member${
      interestedUsers === 1 ? "" : "s"
    } in the data right now. That is probably not enough to count on a large turnout, but if you are after a smaller-group activity, this could still be a thoughtful and workable choice.`,
    `This idea is relevant to "${categoryName}" and currently has ${interestedUsers} interested member${
      interestedUsers === 1 ? "" : "s"
    }. The numbers are modest, so it would be better treated as a smaller-group option rather than a big social, but it could still work well in that setting.`,
    `This idea has some support through "${categoryName}", with ${interestedUsers} interested member${
      interestedUsers === 1 ? "" : "s"
    } currently recorded. That is not a large audience yet, so turnout may be limited, though it could still suit a more intimate or targeted session quite well.`,
  ];

  return pickRandom(messages);
}

function buildGoodIdeaMessage(categoryName, interestedUsers) {
  const messages = [
    `This idea looks promising because it lines up with "${categoryName}" and already has ${interestedUsers} interested members behind it. The broader signals for this category suggest it has a realistic chance of performing well.`,
    `This feels like a strong option. It matches "${categoryName}", has ${interestedUsers} interested members, and the overall category data gives it a solid base to build from.`,
    `This idea appears well supported. It connects to "${categoryName}", has ${interestedUsers} interested members, and the data suggests it has a good chance of attracting meaningful engagement.`,
  ];

  return pickRandom(messages);
}

function buildMaybeMessage(categoryName, interestedUsers) {
  const messages = [
    `This idea has some promise because it connects to "${categoryName}", although the data suggests a bit of caution before treating it as a clear win. There is enough relevance to keep it in play, but not quite enough support yet to make it a confident yes.`,
    `This is a reasonable idea to consider because it fits "${categoryName}", but the support behind it is still mixed. It may work, though it feels more like a cautious maybe than an especially strong recommendation.`,
    `There is enough relevance here to keep the idea on the table, especially as it matches "${categoryName}". That said, the current support is still a little uneven, so it would be sensible to approach it with measured expectations.`,
  ];

  return pickRandom(messages);
}

function buildLowSupportMatchMessage(categoryName) {
  const messages = [
    `This idea does relate to "${categoryName}", but the current support behind it is still too light to make it feel especially strong right now. It may be better as a future idea or a smaller test rather than a main recommendation.`,
    `There is some relevance here through "${categoryName}", but the current signals are not strong enough to support it confidently. At the moment it feels more like a risky option than a well-backed one.`,
    `This matches "${categoryName}" to some extent, but the database does not yet show enough support to make it feel like a dependable recommendation. It could still be explored later, though it does not look especially convincing right now.`,
  ];

  return pickRandom(messages);
}

function buildDeterministicDescription(evaluation) {
  const categoryName = evaluation?.category_name || "";
  const interestedUsers = toNumber(evaluation?.interested_count, 0);

  if (!categoryName) {
    return buildNoMatchMessage(evaluation?.title || "");
  }

  if (interestedUsers > 0 && interestedUsers < 5) {
    return buildSmallGroupMessage(categoryName, interestedUsers);
  }

  if (evaluation?.verdict === "good idea") {
    return buildGoodIdeaMessage(categoryName, interestedUsers);
  }

  if (evaluation?.verdict === "maybe") {
    return buildMaybeMessage(categoryName, interestedUsers);
  }

  return buildLowSupportMatchMessage(categoryName);
}

function evaluateIdeaStrength(ideaInsights) {
  const matchedCategory = ideaInsights?.matchedCategory || "";
  const suggestedCategory = ideaInsights?.suggestedCategory || "";
  const finalCategory = matchedCategory || suggestedCategory || "";

  const interestedUsers = toNumber(
    ideaInsights?.interestStats?.interested_users,
    0
  );

  const totalEvents = toNumber(ideaInsights?.categoryStats?.total_events, 0);
  const totalRegisteredUsers = toNumber(
    ideaInsights?.categoryStats?.total_registered_users,
    0
  );
  const totalAttended = toNumber(ideaInsights?.categoryStats?.total_attended, 0);
  const totalCancelled = toNumber(
    ideaInsights?.categoryStats?.total_cancelled,
    0
  );
  const totalRegistered = toNumber(
    ideaInsights?.categoryStats?.total_registered,
    0
  );
  const totalUnresponsive = toNumber(
    ideaInsights?.categoryStats?.total_unresponsive,
    0
  );

  const attendanceRate =
    totalRegisteredUsers > 0 ? totalAttended / totalRegisteredUsers : 0;

  const cancellationRate =
    totalRegisteredUsers > 0 ? totalCancelled / totalRegisteredUsers : 0;

  const unresponsiveRate =
    totalRegisteredUsers > 0 ? totalUnresponsive / totalRegisteredUsers : 0;

  const registrationMomentum =
    totalEvents > 0 ? totalRegisteredUsers / totalEvents : 0;

  let score = 0;
  const reasons = [];

  if (matchedCategory) {
    score += 25;
    reasons.push(`Direct match to "${matchedCategory}"`);
  } else if (suggestedCategory) {
    score += 10;
    reasons.push(`Closest relevant category is "${suggestedCategory}"`);
  } else {
    return {
      title: ideaInsights?.userIdea || "Suggested Event Idea",
      description: buildNoMatchMessage(ideaInsights?.userIdea || ""),
      verdict: "not recommended",
      confidence: "low",
      category_name: "",
      categories: [],
      interested_count: 0,
      analysis: {
        score: 0,
        interested_users: 0,
        total_events: 0,
        attendance_rate: 0,
        cancellation_rate: 0,
        unresponsive_rate: 0,
        registration_momentum: 0,
        reasons: ["No strong category match found"],
      },
    };
  }

  if (interestedUsers >= 8) {
    score += 30;
    reasons.push(`Strong interest size (${interestedUsers} interested members)`);
  } else if (interestedUsers >= 5) {
    score += 20;
    reasons.push(`Healthy interest size (${interestedUsers} interested members)`);
  } else if (interestedUsers >= 3) {
    score += 8;
    reasons.push(`Some interest exists (${interestedUsers} interested members)`);
  } else if (interestedUsers >= 1) {
    score -= 8;
    reasons.push(
      `Interest is currently small (${interestedUsers} interested member${
        interestedUsers === 1 ? "" : "s"
      })`
    );
  } else {
    score -= 20;
    reasons.push("No recorded interest for this category");
  }

  if (totalEvents >= 3) {
    score += 10;
    reasons.push(
      `There is good event history in this category (${totalEvents} past events)`
    );
  } else if (totalEvents >= 1) {
    score += 4;
    reasons.push(
      `There is some event history in this category (${totalEvents} past event${
        totalEvents === 1 ? "" : "s"
      })`
    );
  } else {
    score -= 2;
    reasons.push("No past event history in this category yet");
  }

  if (totalRegisteredUsers > 0) {
    if (attendanceRate >= 0.6) {
      score += 20;
      reasons.push(
        `Strong attendance history (${round(attendanceRate * 100)}% attended)`
      );
    } else if (attendanceRate >= 0.35) {
      score += 10;
      reasons.push(
        `Reasonable attendance history (${round(attendanceRate * 100)}% attended)`
      );
    } else if (attendanceRate > 0) {
      score -= 8;
      reasons.push(
        `Weak attendance history (${round(attendanceRate * 100)}% attended)`
      );
    }
  }

  if (totalEvents > 0) {
    if (registrationMomentum >= 4) {
      score += 10;
      reasons.push(
        `Past events attracted good registration numbers (${round(
          registrationMomentum
        )} registrations per event)`
      );
    } else if (registrationMomentum >= 2) {
      score += 5;
      reasons.push(
        `Past events attracted some registrations (${round(
          registrationMomentum
        )} per event)`
      );
    } else {
      score -= 4;
      reasons.push(
        `Past events attracted limited registrations (${round(
          registrationMomentum
        )} per event)`
      );
    }
  }

  if (totalRegisteredUsers > 0) {
    if (cancellationRate >= 0.3) {
      score -= 8;
      reasons.push(
        `Cancellation rate is quite high (${round(cancellationRate * 100)}%)`
      );
    }

    if (unresponsiveRate >= 0.4) {
      score -= 12;
      reasons.push(
        `A high share of invited users were unresponsive (${round(
          unresponsiveRate * 100
        )}%)`
      );
    } else if (unresponsiveRate >= 0.2) {
      score -= 5;
      reasons.push(
        `Some users were unresponsive (${round(unresponsiveRate * 100)}%)`
      );
    }
  }

  if (interestedUsers < 3 && score > 45) {
    score = 45;
    reasons.push("Verdict capped because the interest pool is still small");
  }

  let verdict = "not recommended";
  let confidence = "low";

  if (score >= 70) {
    verdict = "good idea";
    confidence = "high";
  } else if (score >= 45) {
    verdict = "maybe";
    confidence = "medium";
  } else if (score >= 25) {
    verdict = "maybe";
    confidence = "low";
  } else {
    verdict = "not recommended";
    confidence = "low";
  }

  return {
    title: ideaInsights?.userIdea || "Suggested Event Idea",
    description: "",
    verdict,
    confidence,
    category_name: finalCategory,
    categories: finalCategory ? [finalCategory] : [],
    interested_count: interestedUsers,
    analysis: {
      score,
      interested_users: interestedUsers,
      total_events: totalEvents,
      total_registered_users: totalRegisteredUsers,
      total_attended: totalAttended,
      total_cancelled: totalCancelled,
      total_registered: totalRegistered,
      total_unresponsive: totalUnresponsive,
      attendance_rate: round(attendanceRate * 100),
      cancellation_rate: round(cancellationRate * 100),
      unresponsive_rate: round(unresponsiveRate * 100),
      registration_momentum: round(registrationMomentum),
      reasons,
    },
  };
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
Do NOT invent categories.
Do NOT change ranking.
Return VALID JSON ONLY.

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
- keep exact category names
- categories should contain the same category_name
- interested_count must match provided values
- best_location must match provided values
- if no niche category exists, set nicheSuggestion to null

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
        title: aiSuggestion.title || `${interest.category_name} Social`,
        description:
          aiSuggestion.description ||
          `${interest.category_name} is one of the most popular interests in your database based on unique users, making it a strong choice for a new event.`,
        estimated_cost: aiSuggestion.estimated_cost || "Low to medium",
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
  const evaluation = evaluateIdeaStrength(ideaInsights);

  if (!evaluation.category_name) {
    return evaluation;
  }

  const interestedUsers = toNumber(evaluation.interested_count, 0);

  // Force deterministic custom descriptions for the cases you explicitly want
  if (interestedUsers > 0 && interestedUsers < 5) {
    return {
      ...evaluation,
      description: buildSmallGroupMessage(
        evaluation.category_name,
        interestedUsers
      ),
    };
  }

  // Also use deterministic wording for weaker low-confidence outcomes
  if (evaluation.verdict === "not recommended") {
    return {
      ...evaluation,
      description: buildLowSupportMatchMessage(evaluation.category_name),
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    return {
      ...evaluation,
      description: buildDeterministicDescription(evaluation),
    };
  }

  const prompt = `
You are writing a short explanation for an event idea assessment.

Important:
- DO NOT decide the verdict yourself.
- DO NOT change the verdict or confidence.
- Use the verdict and confidence already provided.
- Write 2-3 sentences max.
- Base your explanation ONLY on the data below.
- Avoid generic wording.
- Mention specific numbers when useful.
- Keep the tone warm, realistic, and useful.

Return VALID JSON ONLY in this shape:
{
  "description": "string"
}

ASSESSMENT:
${JSON.stringify(evaluation, null, 2)}

DATABASE INSIGHTS:
${JSON.stringify(ideaInsights, null, 2)}
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

    return {
      ...evaluation,
      description:
        parsed?.description || buildDeterministicDescription(evaluation),
    };
  } catch (err) {
    console.error("Gemini validation fallback triggered:", err.message);

    return {
      ...evaluation,
      description: buildDeterministicDescription(evaluation),
    };
  }
}

async function suggestEventLocationsWithAi({
  activity,
  category,
  city,
  date,
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from the root .env file");
  }

  const prompt = `
You are helping a workplace social app suggest real event locations.

Use live web search results to find suitable places for this event.
Only suggest real places that appear to currently exist.
Prefer official venue websites or well-known listing sources when possible.

Return VALID JSON ONLY in this exact shape:
{
  "locations": [
    {
      "name": "string",
      "address": "string",
      "why_it_fits": "string",
      "source_hint": "string"
    }
  ]
}

Rules:
- give 3 to 5 suggestions
- suggestions must be relevant to the activity
- keep the wording concise
- do not invent venues
- if exact matches are limited, return the closest suitable real venues
- source_hint should be a short plain-text source note like "official website" or "Google Maps listing"

Event activity: ${activity || ""}
Category: ${category || ""}
Preferred city: ${city || ""}
Event date: ${date || ""}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ google_search: {} }], // changed: correct Gemini live web search tool name
      responseMimeType: "application/json", // changed: asks for structured JSON output
    },
  });

  const rawText =
    typeof response.text === "function" ? response.text() : response.text || "";

  const parsed = JSON.parse(rawText);

  return parsed;
}

module.exports = {
  generateAiSuggestions,
  validateIdeaWithAi,
  suggestEventLocationsWithAi, // changed: export new live location suggestion function
};