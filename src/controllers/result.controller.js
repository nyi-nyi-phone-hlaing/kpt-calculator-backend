const Result = require("../models/result.model");
const Customer = require("../models/customer.model");
const calculateTotal = require("../utils/calculateTotal");
const { validationResult } = require("express-validator");

exports.getAllResults = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const results = await Result.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalResults = await Result.countDocuments({});
    const totalPages = Math.ceil(totalResults / limit);
    const currentPage = page;

    return res.status(200).json({
      results,
      totalPages,
      totalResults,
      currentPage,
      status: "success",
      code: 200,
      message: "Results fetched successfully",
    });
  } catch (error) {
    console.error("Error getting results:", error);
    return res
      .status(500)
      .json({ error: "Error getting results", code: 500, status: "error" });
  }
};

exports.getResultsByDate = async (req, res) => {
  const { date } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const results = await Result.find({ date })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalResults = await Result.countDocuments({ date });
    const totalPages = Math.ceil(totalResults / limit);
    const currentPage = page;

    return res.status(200).json({
      results,
      totalPages,
      totalResults,
      currentPage,
      status: "success",
      code: 200,
      message: "Results fetched successfully by date",
    });
  } catch (error) {
    console.error("Error getting results:", error);
    return res
      .status(500)
      .json({ error: "Error getting results", code: 500, status: "error" });
  }
};

exports.getResultById = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const result = await Result.findById(id);
    if (!result) {
      return res
        .status(404)
        .json({ error: "Result not found", code: 404, status: "error" });
    }

    return res.status(200).json({
      result,
      status: "success",
      code: 200,
      message: "Result fetched successfully",
    });
  } catch (error) {
    console.error("Error getting results:", error);
    return res.status(500).json({ error: "Error getting result" });
  }
};

exports.searchResultsByName = async (req, res) => {
  const { name } = req.query;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const results = await Result.find({ name: name.toUpperCase() });
    return res.status(200).json({
      results,
      status: "success",
      code: 200,
      message: "Results fetched successfully",
    });
  } catch (error) {
    console.error("Error getting results:", error);
    return res
      .status(500)
      .json({ error: "Error getting results", code: 500, status: "error" });
  }
};

exports.addResult = async (req, res) => {
  const { name, morning, evening, morning_win, evening_win } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const customer = await Customer.findOne({ name: name.toUpperCase() });

    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found", code: 404, status: "error" });
    }

    const total = calculateTotal(
      morning,
      evening,
      morning_win,
      evening_win,
      customer.commission,
      customer.gameX
    );

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB");

    const result = await Result.create({
      name,
      morning,
      evening,
      morning_win,
      evening_win,
      commission: customer.commission,
      gameX: customer.gameX,
      total: Math.round(total / 50) * 50,
      date: formattedDate,
      customer_details: customer._id,
    });

    return res.status(201).json({
      result,
      status: "success",
      code: 201,
      message: "Result created successfully",
    });
  } catch (error) {
    console.error("Error creating result:", error);
    return res.status(500).json({ error: "Error creating result" });
  }
};

exports.updateResult = async (req, res) => {
  const { id } = req.params;
  const { name, morning, evening, morning_win, evening_win } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const customer = await Customer.findOne({
      name: name.toUpperCase(),
    });

    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found", code: 404, status: "error" });
    }

    const result = await Result.findById(id);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Result not found", code: 404, status: "error" });
    }

    const total = calculateTotal(
      morning,
      evening,
      morning_win,
      evening_win,
      customer.commission,
      customer.gameX
    );

    result.history.push({
      name: result.name,
      morning: result.morning,
      evening: result.evening,
      morning_win: result.morning_win,
      evening_win: result.evening_win,
      commission: result.commission,
      gameX: result.gameX,
      total: result.total,
      timestamp: new Date().toISOString(),
    });

    result.name = name;
    result.morning = morning;
    result.evening = evening;
    result.morning_win = morning_win;
    result.evening_win = evening_win;
    result.commission = customer.commission;
    result.gameX = customer.gameX;
    result.total = Math.round(total / 50) * 50;
    result.customer_details = customer._id;

    await result.save();

    return res.status(200).json({
      result,
      status: "success",
      code: 200,
      message: "Result updated successfully",
    });
  } catch (error) {
    console.error("Error creating result:", error);
    return res.status(500).json({ error: "Error creating result" });
  }
};

exports.deleteResult = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Result not found", code: 404, status: "error" });
    }

    return res.status(200).json({
      result,
      status: "success",
      code: 200,
      message: "Result deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting result:", error);
    return res.status(500).json({ error: "Error deleting result" });
  }
};
