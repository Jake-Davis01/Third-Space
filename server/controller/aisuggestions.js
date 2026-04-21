const Event = require("../models/Aisuggestions");
const {
  generateAiSuggestions,
  validateIdeaWithAi,
} = require("../services/geminiService");

const createEvent = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const event = new Event({
      ...req.body,
      user_email: req.body.user_email,
    });

    const savedEvent = await event.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

const getPopularEvents = async (req, res) => {
  try {
    const events = await Event.getPopularEvents();
    console.log("POPULAR EVENTS:", events);
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching popular events:", err);
    res.status(500).json({ error: "Failed to fetch popular events" });
  }
};

const getSuggestionInsights = async (req, res) => {
  try {
    const insights = await Event.getSuggestionInsights();
    res.status(200).json(insights);
  } catch (err) {
    console.error("Error fetching suggestion insights:", err);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};

const getAiSuggestions = async (req, res) => {
  try {
    const insights = await Event.getSuggestionInsights();
    const suggestions = await generateAiSuggestions(insights);
    res.status(200).json(suggestions);
  } catch (err) {
    console.error("Error generating AI suggestions:", err);
    console.error("Gemini error message:", err.message);
    console.error("Gemini error details:", err.stack);
    res.status(500).json({ error: "Failed to generate AI suggestions" });
  }
};

const validateIdea = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("IDEA RECEIVED:", req.body.idea);

    const { idea } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: "Idea is required" });
    }

    const ideaInsights = await Event.getIdeaValidationInsights(idea.trim());
    const result = await validateIdeaWithAi(ideaInsights);

    if (result.rawText) {
      return res.status(200).json({
        title: idea.trim(),
        description: result.rawText,
        verdict: "maybe",
        confidence: "low",
        category_name: ideaInsights?.matchedCategory || "",
        categories: ideaInsights?.matchedCategory
          ? [ideaInsights.matchedCategory]
          : [],
        interested_count: Number(ideaInsights?.interestStats?.interested_users || 0),
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error validating idea:", err);
    console.error("Validation error message:", err.message);
    console.error("Validation error stack:", err.stack);
    res.status(500).json({ error: "Failed to validate idea" });
  }
};

module.exports = {
  createEvent,
  getPopularEvents,
  getSuggestionInsights,
  getAiSuggestions,
  validateIdea,
};