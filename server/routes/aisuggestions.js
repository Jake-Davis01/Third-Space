const express = require("express");
const router = express.Router();
const {
  createEvent,
  getPopularEvents,
  getSuggestionInsights,
  getAiSuggestions,
  validateIdea,
} = require("../controller/aisuggestions");

console.log("Loaded aisuggestions routes");

router.get("/events-test", (req, res) => {
  res.json({ message: "aisuggestions route is working" });
});

router.get("/events/popular", getPopularEvents);
router.get("/ai/insights/suggestions", getSuggestionInsights);
router.get("/ai/suggestions", getAiSuggestions);
router.post("/ai/validate-idea", validateIdea);

router.post(
  "/events",
  (req, res, next) => {
    console.log("POST /api/events hit");
    next();
  },
  createEvent
);

module.exports = router;