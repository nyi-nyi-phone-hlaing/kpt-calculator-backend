const User = require("../models/user.model");
const Results = require("../models/result.model");
const Customer = require("../models/customer.model");

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const users = await User.find({ role: "User" })
      .limit(limit)
      .skip((page - 1) * limit)
      .select("-password -__v")
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments({ role: "User" });
    const totalPages = Math.ceil(totalUsers / limit);

    return res
      .status(200)
      .json({ users, totalPages, totalUsers, status: "success", code: 200 });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, code: 500, status: "error" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "User" });
    const admins = await User.countDocuments({ role: "Admin" });
    const results = await Results.countDocuments({});
    const customers = await Customer.countDocuments({});
    const resultsData = await Results.find({});
    const totalMorningSales = resultsData.reduce(
      (acc, result) => acc + result.morning,
      0
    );
    const totalEveningSales = resultsData.reduce(
      (acc, result) => acc + result.evening,
      0
    );
    const totalMorningWin = resultsData.reduce(
      (acc, result) => acc + result.morning_win,
      0
    );
    const totalEveningWin = resultsData.reduce(
      (acc, result) => acc + result.evening_win,
      0
    );

    const totalNetwork = resultsData.reduce(
      (acc, result) => acc + result.total,
      0
    );

    const dashboardData = {
      users,
      admins,
      results,
      customers,
      totalMorningSales,
      totalEveningSales,
      totalMorningWin,
      totalEveningWin,
      totalNetwork,
    };

    return res
      .status(200)
      .json({ dashboardData, status: "success", code: 200 });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, code: 500, status: "error" });
  }
};

exports.getAllResults = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  try {
    const results = await Results.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalResults = await Results.countDocuments({});
    const totalPages = Math.ceil(totalResults / limit);

    return res.status(200).json({
      results,
      totalPages,
      totalResults,
      status: "success",
      code: 200,
      message: "Results",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, code: 500, status: "error" });
  }
};

exports.getAllCustomers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  try {
    const customers = await Customer.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalCustomers = await Customer.countDocuments({});
    const totalPages = Math.ceil(totalCustomers / limit);

    return res.status(200).json({
      customers,
      totalPages,
      totalCustomers,
      status: "success",
      code: 200,
      message: "Customers",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, code: 500, status: "error" });
  }
};
