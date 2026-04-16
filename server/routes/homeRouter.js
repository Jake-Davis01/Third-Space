const express = require("express");
const homeRouter = express.Router();
const db = require("../database/connect");
const homeController = require('../controller/homeController');

homeRouter.get("/newEvent/:userEmail", homeController.newUserEvent)

homeRouter.post("/newEvent/:id", homeController.joinEvent)

module.exports = homeRouter;