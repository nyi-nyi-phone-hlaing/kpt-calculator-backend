const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const isAdmin = require("../middlewares/isAdmin");
const {
  checkUsername,
  checkPassword,
  checkEnum,
  checkEmail,
} = require("../validation/validationForResult");
const checkMongooseId = require("../validation/checkMongooseId");
const checkValidToken = require("../validation/checkValidToken");
const isAuth = require("../middlewares/isAuth");

router.post(
  "/login",
  [checkEmail("email"), checkPassword("password")],
  authController.login
);

router.post(
  "/register",
  [
    isAuth,
    isAdmin,
    checkUsername("username"),
    checkPassword("password"),
    checkEnum("role", ["Admin", "User"]),
    checkEmail("email"),
  ],
  authController.register
);

router.delete(
  "/delete/:id",
  [isAdmin, checkMongooseId("id")],
  authController.deleteAccount
);

router.post(
  "/logout/userId/:userId/token/:token",
  [isAuth, checkMongooseId("userId"), checkValidToken("token")],
  authController.logout
);

module.exports = router;
