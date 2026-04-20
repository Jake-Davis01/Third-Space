const Event = require("../models/AiSuggestions");
const { runAgent } = require("../your-agent-service-path"); 
// adjust path to your agentService.js

async function generateAISuggestions(userQuery) {
  // STEP 1: pull raw structured data from DB (via model)
  const insights = await Event.getSuggestionInsights();
  const popular = await Event.getPopularEvents();

  // STEP 2: send to your agent as context
  const prompt = `
You are an AI event strategist.

Use the following data:

POPULAR EVENTS:
${JSON.stringify(popular, null, 2)}

INSIGHTS:
${JSON.stringify(insights, null, 2)}

User request:
${userQuery}

Recommend what events should be created next and why.
`;

  // STEP 3: run your existing agent
  const result = await runAgent(prompt);

  return result;
}

module.exports = {
  generateAISuggestions,
};