const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");
const checkMongooseId = require("../validation/checkMongooseId");
const {
  checkName,
  checkNumber,
  checkEnum,
} = require("../validation/validationForResult");

router.get("/", customerController.getAllCustomers);

router.get("/:id", checkMongooseId("id"), customerController.getCustomerById);

router.post(
  "/create",
  [
    checkName("name"),
    checkNumber("commission"),
    checkNumber("gameX"),
    checkEnum("type", ["In", "Out", "Both"]),
    checkEnum("payType", ["Daily", "Weekly"]),
  ],
  customerController.addCustomer
);

router.patch(
  "/update/:id",
  checkMongooseId("id"),
  [
    checkName("name"),
    checkNumber("commission"),
    checkNumber("gameX"),
    checkEnum("type", ["In", "Out", "Both"]),
    checkEnum("payType", ["Daily", "Weekly"]),
  ],
  customerController.updateCustomer
);

router.delete(
  "/delete/:id",
  checkMongooseId("id"),
  customerController.deleteCustomer
);

module.exports = router;
