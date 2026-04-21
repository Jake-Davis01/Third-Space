const Event = require('../models/Event')

async function userEvents(req, res) {
    const userEmail = req.params.userEmail;
    //console.log(userEmail)
    try {
        const result = await Event.getUserEvents(userEmail);
        res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
}

async function cancelEvent(req, res) {
    const eventToCancel = req.body
    //console.log(eventToCancel);
    try {
        const result = await Event.cancelEvent(eventToCancel);
        res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
}

module.exports = {
    userEvents,
    cancelEvent
}