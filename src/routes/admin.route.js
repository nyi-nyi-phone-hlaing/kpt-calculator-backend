const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

router.get("/users", adminController.getAllUsers);

router.get("/dashboard", adminController.getDashboardData);

router.get("/results", adminController.getAllResults);

router.get("/customers", adminController.getAllCustomers);

router.get("/chart", adminController.getChart);

router.delete("/delete/all-results", adminController.deleteAllResults);

module.exports = router;
