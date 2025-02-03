const express = require("express");
const router = express.Router();

const { checkName, checkNumber } = require("../validation/validationForResult");
const checkMongooseId = require("../validation/checkMongooseId");
const checkDateFormat = require("../validation/checkDateFormat");
const checkSearchQuery = require("../validation/checkSearchQuery");

const resultController = require("../controllers/result.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");

router.get("/", isAuth, resultController.getAllResults);

router.get(
  "/by-date",
  isAuth,
  checkDateFormat("date"),
  resultController.getResultsByDate
);

router.get(
  "/search",
  isAuth,
  checkSearchQuery("name"),
  resultController.searchResultsByName
);

router.get(
  "/:id",
  isAuth,
  checkMongooseId("id"),
  resultController.getResultById
);

router.post(
  "/create",
  [
    isAdmin,
    checkName("name"),
    checkNumber("morning"),
    checkNumber("evening"),
    checkNumber("morning_win"),
    checkNumber("evening_win"),
  ],
  resultController.addResult
);

router.patch(
  "/update/:id",
  [
    isAdmin,
    checkMongooseId("id"),
    checkName("name"),
    checkNumber("morning"),
    checkNumber("evening"),
    checkNumber("morning_win"),
    checkNumber("evening_win"),
  ],
  resultController.updateResult
);

router.delete(
  "/delete/:id",
  isAdmin,
  checkMongooseId("id"),
  resultController.deleteResult
);

module.exports = router;
