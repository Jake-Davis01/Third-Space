const express = require("express");
const authRouter = express.Router();
const db = require("../database/connect");
const accountController = require('../controller/user');

authRouter.post("/register", accountController.register); 
authRouter.post("/login", accountController.login); 

module.exports = authRouter;