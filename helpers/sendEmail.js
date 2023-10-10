const nodemailer = require("nodemailer");
require("dotenv").config();

const { PASSWORD, EMAIL_FROM } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const emailOptions = {
    from: EMAIL_FROM,
    ...data,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
