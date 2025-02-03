const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist.model");

require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization === undefined) {
      return res.status(401).json({
        error: "Unauthorized. Please login",
        code: 401,
        status: "error",
      });
    }
    const token = req.headers.authorization.split(" ")[1];

    const blacklist = await Blacklist.findOne({ token });

    if (blacklist) {
      return res.status(401).json({
        error: "Your token has been revoked. Please login again",
        code: 401,
        status: "error",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Admin") {
      return res.status(401).json({
        error: "Access denied. Only admin allowed",
        code: 401,
        status: "error",
      });
    }
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid token", code: 400, status: "error" });
  }
};
