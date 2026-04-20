const Event = require("../models/AiSuggestions");
const AiSuggestions = require("../models/AiSuggestions");

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
    const insights = await AiSuggestions.getSuggestionInsights();
    res.status(200).json(insights);
  } catch (err) {
    console.error("Error fetching suggestion insights:", err);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};

module.exports = {
  createEvent,
  getPopularEvents,
  getSuggestionInsights,
};