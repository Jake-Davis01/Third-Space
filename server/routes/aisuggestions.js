const express = require("express");
const router = express.Router();
const { createEvent, getPopularEvents } = require("../controller/aisuggestions");

console.log("Loaded aisuggestions routes");

router.get("/events-test", (req, res) => {
  res.json({ message: "aisuggestions route is working" });
});

router.get("/events/popular", getPopularEvents);

router.post(
  "/events",
  (req, res, next) => {
    console.log("POST /api/events hit");
    next();
  },
  createEvent
);

module.exports = router;