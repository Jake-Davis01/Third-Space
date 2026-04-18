const express = require("express");
const eventPageRouter = express.Router();
const db = require("../database/connect");
const eventPageController = require('../controller/eventsPageController');


eventPageRouter.get("/userEvents/:userEmail", eventPageController.userEvents)

eventPageRouter.patch("/userEvents/", eventPageController.cancelEvent)

module.exports = eventPageRouter;