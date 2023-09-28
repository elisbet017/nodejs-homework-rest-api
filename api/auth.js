const express = require("express")

const authRouter = express.Router()

const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} = require("../controller/auth");
const { authenticate } = require("../middlewares");

authRouter.post("/users/register", registerUser);

authRouter.post("/users/login", loginUser);

authRouter.post("/users/logout", authenticate, logoutUser);

authRouter.get("/users/current", authenticate, currentUser);

module.exports = authRouter;