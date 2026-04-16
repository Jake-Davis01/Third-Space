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

module.exports = {
    newUserEvent
}