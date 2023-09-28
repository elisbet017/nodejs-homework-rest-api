const { User } = require("../models/user");

const register = async (body) => {
  const result = await User.create(body);
  return result;
};

const login = async (body) => {
  const user = await User.findOne({ email: body.email });
  return user || null;
};

module.exports = {
  register,
  login,
};
