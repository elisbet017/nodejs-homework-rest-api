const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const { findUser } = require("../service/auth");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  const { SECRET_KEY } = process.env;
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await findUser(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
