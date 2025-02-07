const User = require("../models/user.model");
const Results = require("../models/result.model");
const Customer = require("../models/customer.model");
const dailyData = require("../utils/dailyData");
const { Result } = require("express-validator");

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
    const currentPage = page;

    return res.status(200).json({
      users,
      totalPages,
      totalUsers,
      currentPage,
      message: "Getting all users successfully.",
      status: "success",
      code: 200,
    });
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

    return res.status(200).json({
      dashboardData,
      message: "Getting dashboard data successfully.",
      status: "success",
      code: 200,
    });
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
      message: "Getting all results successfully.",
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
    const currentPage = page;

    return res.status(200).json({
      customers,
      totalPages,
      totalCustomers,
      currentPage,
      status: "success",
      code: 200,
      message: "Getting all customers successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, code: 500, status: "error" });
  }
};

exports.getChart = async (req, res) => {
  try {
    const results = await Results.find().sort({ createdAt: -1 });
    const labels = results.map((result) => result.date);
    const dailyMorningSales = dailyData(results, "morning");
    const dailyEveningSales = dailyData(results, "evening");
    const dailyMorningWin = dailyData(results, "morning_win");
    const dailyEveningWin = dailyData(results, "evening_win");
    const dailyNetwork = dailyData(results, "total");

    return res.status(200).json({
      labels: Array.from(new Set(labels)),
      dailyMorningSales,
      dailyEveningSales,
      dailyMorningWin,
      dailyEveningWin,
      dailyNetwork,
      message: "Getting Chart data successfully",
      status: "success",
      code: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, code: 500, status: "error" });
  }
};

exports.deleteAllResults = async (req, res) => {
  try {
    const { deletedCount } = await Results.deleteMany({});

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No results found to delete.",
        status: "error",
        code: 404,
      });
    }

    return res.status(200).json({
      message: `Deleted ${deletedCount} results successfully.`,
      status: "success",
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      code: 500,
      status: "error",
    });
  }
};
