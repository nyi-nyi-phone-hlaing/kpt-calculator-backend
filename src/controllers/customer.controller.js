const Customer = require("../models/customer.model");
const Result = require("../models/result.model");
const { validationResult } = require("express-validator");

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    return res.status(200).json({
      customers,
      status: "success",
      code: 200,
      message: "Customers fetched successfully",
    });
  } catch (error) {
    console.error("Error getting customers:", error);
    return res
      .status(500)
      .json({ error: "Error getting customers", code: 500, status: "error" });
  }
};

exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found", code: 404, status: "error" });
    }

    return res.status(200).json({
      customer,
      status: "success",
      code: 200,
      message: "Customer fetched successfully",
    });
  } catch (error) {
    console.error("Error getting customer:", error);
    return res
      .status(500)
      .json({ error: "Error getting customer", code: 500, status: "error" });
  }
};

exports.addCustomer = async (req, res) => {
  const { name, commission, gameX, type, payType } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB");

    const customer = new Customer({
      name: name.toUpperCase(),
      commission,
      gameX,
      type,
      payType,
      date: formattedDate,
    });
    await customer.save();

    return res.status(201).json({
      customer,
      status: "success",
      code: 201,
      message: "Customer added successfully",
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    return res
      .status(500)
      .json({ error: "Error adding customer", code: 500, status: "error" });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, commission, gameX, type, payType } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found", code: 404, status: "error" });
    }
    if (name !== customer.name) {
      await Result.updateMany(
        { name: customer.name },
        { name: name, formerCustomerName: customer.name }
      );
    }

    customer.history.push({
      name: customer.name,
      commission: customer.commission,
      gameX: customer.gameX,
      type: customer.type,
      payType: customer.payType,
      timestamp: new Date().toISOString(),
    });
    customer.name = name.toUpperCase();
    customer.commission = commission;
    customer.gameX = gameX;
    customer.type = type;
    customer.payType = payType;

    await customer.save();

    return res.status(200).json({
      customer,
      status: "success",
      code: 200,
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return res
      .status(500)
      .json({ error: "Error updating customer", code: 500, status: "error" });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), code: 400, status: "error" });
  }

  try {
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found", code: 404, status: "error" });
    }

    const result = await Result.find({ name: customer.name });
    if (result.length > 0) {
      await Result.deleteMany({ name: customer.name });
    }

    return res.status(200).json({
      customer,
      status: "success",
      code: 200,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return res
      .status(500)
      .json({ error: "Error deleting customer", code: 500, status: "error" });
  }
};
