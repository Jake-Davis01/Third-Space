const express = require("express");
const authRouter = express.Router();
const db = require("../database/connect");
const accountController = require('../controller/user');

authRouter.post("/register", accountController.register); 
authRouter.post("/login", accountController.login); 
authRouter.patch("/profile/:email", accountController.updateProfile);
authRouter.get("/profile/:email", accountController.getProfile); 

module.exports = authRouter;