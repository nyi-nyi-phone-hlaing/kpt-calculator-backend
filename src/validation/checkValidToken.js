const { param } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkValidToken = (token) => {
  return param(token).custom((value) => {
    const decoded = jwt.verify(value, process.env.JWT_SECRET);

    if (!decoded) {
      throw new Error("Invalid token");
    }
    return true;
  });
};

module.exports = checkValidToken;
