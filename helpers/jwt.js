const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (id) => {
  const { SECRET_KEY } = process.env;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  return token;
};

// try {
//   const { id } = jwt.verify(token, SECRET_KEY);
// } catch (e) {
//   console.log(e.message)
// }
module.exports = createToken;
