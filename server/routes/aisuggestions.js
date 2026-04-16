const express = require("express");
const router = express.Router();
const { createEvent } = require("../controller/aisuggestions");

console.log("Loaded aisuggestions routes");

router.get("/events-test", (req, res) => {
  res.json({ message: "aisuggestions route is working" });
});

router.post("/events", (req, res, next) => {
  console.log("POST /api/events hit");
  next();
}, createEvent);

module.exports = router;