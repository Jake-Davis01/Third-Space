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

module.exports = router;