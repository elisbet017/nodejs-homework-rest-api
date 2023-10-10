const { registerSchema, verifySchema } = require("../models/user.js");
const { addSchema, statusSchema } = require("../models/contact.js");
const { requestError } = require("./requestError.js");

const validateBody = (body) => {
  return addSchema.validate(body);
};

const validateUpdatedFields = (body, res) => {
  const { name, email, phone, favorite } = body;
  if (!name && !email && !phone && !favorite) {
    return res.status(400).json({ message: "missing fields" });
  }
  return addSchema.validate(body);
};

const validateStatusBody = (body) => {
  return statusSchema.validate(body);
};

const validateUser = (res, body) => {
  const validatedData = registerSchema.validate(body);
  if (validatedData.error) {
    return requestError(res, validatedData.error);
  }
};

const validateEmail = (res, body) => {
  const validatedData = verifySchema.validate(body);
  if (validatedData.error) {
    if (validatedData.error.details[0].message === '"email" is required') {
      return res.status(400).json({ message: "missing required field email" });
    }
    requestError(res, validatedData.error);
  }
};

module.exports = {
  validateBody,
  validateUpdatedFields,
  validateStatusBody,
  validateUser,
  validateEmail,
};
