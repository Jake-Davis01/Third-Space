const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

module.exports = { createEvent };