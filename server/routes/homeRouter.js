const express = require("express");
const homeRouter = express.Router();
const db = require("../database/connect");
const homeController = require('../controller/homeController');

homeRouter.get("/newEvent/:userEmail", homeController.newUserEvent)
homeRouter.get("/nextEvent/:userEmail", homeController.nextEvent)

//joining an event
homeRouter.patch("/newEvent/:id", homeController.joinEvent)

//getting / sending a review
homeRouter.get("/pastEvent/:userEmail", homeController.recentPastEvent)
homeRouter.patch("/pastEvent/", homeController.feedback)

module.exports = homeRouter;