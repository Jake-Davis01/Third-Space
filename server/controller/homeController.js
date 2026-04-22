const HomePageEvents = require('../models/HomePageEvents')

async function newUserEvent(req, res) {
    const userEmail = req.params.userEmail;
    //console.log(userEmail);
    try {
        const result = await HomePageEvents.getNewEvent(userEmail);
        res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
}

async function joinEvent(req, res) {
    const eventID = req.params.id;
    const userEmail = req.body.email; // changed: now we need the user's email because no registration row exists yet
    //console.log(eventID);
    try {
        const result = await HomePageEvents.joinEvent(eventID, userEmail);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

async function nextEvent(req, res) {
    const userEmail = req.params.userEmail;
    //console.log(userEmail);
    try {
        const result = await HomePageEvents.nextEvent(userEmail);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

async function recentPastEvent(req,res) {
    const userEmail = req.params.userEmail;
    //console.log(userEmail);
    try {
        const result = await HomePageEvents.recentPastEvent(userEmail);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

async function feedback(req, res) {
    const feedback = req.body;
    //console.log(feedback);
    try {
        const result = await HomePageEvents.feedback(feedback);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

module.exports = {
    newUserEvent,
    joinEvent,
    nextEvent,
    recentPastEvent,
    feedback
}
