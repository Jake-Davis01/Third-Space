const Event = require("../models/AiSuggestions");
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

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEvent = await Event.updateById(id, req.body);

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.deleteById(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "Event deleted successfully",
      event: deletedEvent,
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
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

const getInterestedCount = async (req, res) => {
  try {
    const { category_name, location } = req.query;

    if (!category_name || !category_name.trim()) {
      return res.status(400).json({ error: "category_name is required" });
    }

    const interested_count =
      await Event.getInterestedCountByCategoryAndLocation(
        category_name.trim(),
        location?.trim() || ""
      );

    res.status(200).json({
      category_name: category_name.trim(),
      location: location?.trim() || "",
      interested_count,
    });
  } catch (err) {
    console.error("Error fetching interested count:", err);
    res.status(500).json({ error: "Failed to fetch interested count" });
  }
};

const validateIdea = async (req, res) => {
  try {
    console.log("USING CONTROLLER VALIDATE IDEA");
    console.log("REQ BODY:", req.body);

    const { idea } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: "Idea is required" });
    }

    const trimmedIdea = idea.trim();

    const ideaInsights = await Event.getIdeaValidationInsights(trimmedIdea);
    console.log("IDEA INSIGHTS:", JSON.stringify(ideaInsights, null, 2));

    const result = await validateIdeaWithAi(ideaInsights);
    console.log("AI VALIDATION RESULT:", result);

    if (result && !result.rawText) {
      return res.status(200).json(result);
    }

    const finalCategory =
      ideaInsights?.finalCategory ||
      ideaInsights?.matchedCategory ||
      ideaInsights?.suggestedCategory ||
      "";

    const interestedCount = Number(
      ideaInsights?.interestStats?.interested_users || 0
    );

    if (ideaInsights?.matchedCategory) {
      return res.status(200).json({
        title: trimmedIdea,
        description:
          result?.rawText ||
          `This idea appears relevant because it matches the "${finalCategory}" category in your database and currently has ${interestedCount} interested members.`,
        verdict: interestedCount > 0 ? "good idea" : "maybe",
        confidence: ideaInsights?.matchScore >= 95 ? "high" : "medium",
        category_name: finalCategory,
        categories: finalCategory ? [finalCategory] : [],
        interested_count: interestedCount,
      });
    }

    if (ideaInsights?.suggestedCategory) {
      return res.status(200).json({
        title: trimmedIdea,
        description:
          result?.rawText ||
          `This idea does not exactly match an existing interest in your database, but the closest relevant category is "${finalCategory}", which currently has ${interestedCount} interested members.`,
        verdict: "maybe",
        confidence: "low",
        category_name: finalCategory,
        categories: finalCategory ? [finalCategory] : [],
        interested_count: interestedCount,
      });
    }

    return res.status(200).json({
      title: trimmedIdea,
      description:
        result?.rawText ||
        "This idea has no strong match in the current database interests, so it is not recommended right now.",
      verdict: "not recommended",
      confidence: "low",
      category_name: "",
      categories: [],
      interested_count: 0,
    });
  } catch (err) {
    console.error("Error validating idea:", err);
    console.error("Validation error message:", err.message);
    console.error("Validation error stack:", err.stack);
    res.status(500).json({ error: "Failed to validate idea" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getPopularEvents,
  getSuggestionInsights,
  getAiSuggestions,
  getInterestedCount,
  validateIdea,
};