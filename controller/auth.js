const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
require("dotenv").config();

const { BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const {
  validateData,
  createToken,
  resizeAvatar,
  sendEmail,
} = require("../helpers");
const {
  register,
  verify,
  login,
  logout,
  updateToken,
  updateUserAvatar,
  updateVerification,
} = require("../service/auth");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateData.validateUser(res, req.body);

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await register({
      email: email.trim(),
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email.trim(),
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

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

    if (!user.verify) {
      return res.status(403).json({ message: "Not verified" });
    }

    if (!passwordCompare) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = createToken(user._id);

    await updateToken(user._id, token);

    res.json({
      token: token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (e) {}
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await logout(_id);
  return res.status(204).end();
};

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    await resizeAvatar(tempUpload);
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", fileName);
    await updateUserAvatar(_id, avatarURL);
    res.json({ avatarURL });
  } catch (e) {
    res.status(400).json({ message: "No files" });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await verify(verificationToken);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await updateVerification(user._id);
  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    validateData.validateEmail(res, req.body);
    const user = await login(req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verificationToken) {
      const verifyEmail = {
        to: email.trim(),
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
      };

      await sendEmail(verifyEmail);

      res.json({ message: "Verification email sent" });
    } else {
      res.status(400).json({ message: "Verification has already been passed" });
    }
  } catch (e) {}
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
