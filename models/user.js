const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    avatarURL: String,
    token: String,
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const verifySchema = Joi.object({
  email: Joi.string().required(),
});

const User = mongoose.model("user", userSchema);

module.exports = {
  userSchema,
  registerSchema,
  verifySchema,
  User,
};
