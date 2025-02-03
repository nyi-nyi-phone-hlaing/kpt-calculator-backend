require("dotenv").config();
const User = require("../models/user.model");
const Blacklist = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");
const becrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid user credentials",
        code: 401,
        status: "error",
      });
    }

    const passwordMatch = await becrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid user credentials",
        code: 401,
        status: "error",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );

    return res.status(200).json({
      user,
      token,
      status: "success",
      code: 200,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ error: "Error logging in user", code: 500, status: "error" });
  }
};

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const userExists = await User.findOne({
      $or: [{ username: username.toUpperCase() }, { email }],
    });

    if (userExists) {
      if (userExists.username === username) {
        return res.status(409).json({
          error: "Username already exists.",
          code: 409,
          status: "error",
        });
      }
      if (userExists.email === email) {
        return res.status(409).json({
          error: "Email already exists. Please login",
          code: 409,
          status: "error",
        });
      }
    }

    const salt = await becrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await becrypt.hash(password, salt);

    const user = await User.create({
      username: username.toUpperCase(),
      password: hashedPassword,
      email,
      role,
    });

    return res.status(201).json({
      user,
      status: "success",
      code: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ error: "Error registering user", code: 500, status: "error" });
  }
};

exports.deleteAccount = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized", code: 401, status: "error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.table(decoded);

    if (decoded.role !== "Admin") {
      return res.status(401).json({
        error: "Access denied. Only admin allowed",
        code: 401,
        status: "error",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found", code: 404, status: "error" });
    }

    return res.status(200).json({
      user,
      status: "success",
      code: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: "Error deleting user", code: 500, status: "error" });
  }
};

exports.logout = async (req, res) => {
  const { userId, token } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized", code: 401, status: "error" });
    }

    const blacklist = await Blacklist.create({
      token,
      date: new Date().toLocaleDateString("en-GB"),
    });

    if (!blacklist) {
      return res
        .status(500)
        .json({ error: "Error logging out user", code: 500, status: "error" });
    }

    await blacklist.save();

    res.clearCookie("token");
    res.status(200).json({
      message: "User logged out successfully",
      status: "success",
      code: 200,
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ error: "Error logging out user", code: 500, status: "error" });
  }
};
