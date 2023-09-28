const express = require("express")

const authRouter = express.Router()

const { registerUser, loginUser } = require("../controller/auth");

authRouter.post("/users/register", registerUser);

authRouter.post("/users/login", loginUser);

module.exports = authRouter;