const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getPopularEvents,
  getSuggestionInsights,
  getAiSuggestions,
  getInterestedCount,
  validateIdea,
  suggestLocations, // changed: import route handler
} = require("../controller/aisuggestions");

router.post("/events", createEvent);
router.get("/events", getAllEvents);
router.patch("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

router.get("/ai/popular-events", getPopularEvents);
router.get("/ai/insights", getSuggestionInsights);
router.get("/ai/suggestions", getAiSuggestions);
router.get("/ai/interested-count", getInterestedCount);
router.post("/ai/validate-idea", validateIdea);
router.post("/ai/suggest-locations", suggestLocations); // changed: new endpoint for live venue suggestions

module.exports = router;