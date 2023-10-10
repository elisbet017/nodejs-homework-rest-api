const { User } = require("../models/user");

const register = async (body) => {
  const result = await User.create(body);
  return result;
};

const verify = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  return user || null;
};

const updateVerification = async (_id) => {
  await User.findByIdAndUpdate(_id, {
    verificationToken: null,
    verify: true,
  });
};

const login = async (body) => {
  const user = await User.findOne({ email: body.email });
  return user || null;
};

const logout = async (id) => {
  await User.findByIdAndUpdate(id, { token: "" });
};

const findUser = async (id) => {
  const user = await User.findById(id);
  return user || null;
};

const updateToken = async (id, token) => {
  await User.findByIdAndUpdate(id, { token });
};

const updateUserAvatar = async (id, avatar) => {
  await User.findByIdAndUpdate(id, { avatarURL: avatar });
};

module.exports = {
  register,
  verify,
  login,
  logout,
  findUser,
  updateToken,
  updateUserAvatar,
  updateVerification,
};
