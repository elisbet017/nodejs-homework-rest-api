const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const { SECRET_KEY } = process.env;

const {
  HttpError,
  requestError,
  validateData,
  addRequestError,
} = require("../helpers");
const { register, login } = require("../service/auth");
const createToken = require("../helpers/jwt");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateData.validateUser(res, req.body);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await register({
      email: email.trim(),
      password: hashPassword,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      return res.status(409).json({ message: "Email in use" });
    }
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateData.validateUser(res, req.body);

    const user = await login(req.body);
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }


    if (!passwordCompare) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    
    const token = createToken(user._id);
    
    res.json({
      token: token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
