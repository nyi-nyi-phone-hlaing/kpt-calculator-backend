const { body } = require("express-validator");

const checkName = (fieldName) => {
  return body(fieldName)
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`Invalid ${fieldName} length. Expected length: 1-100`);
};

const checkUsername = (fieldName) => {
  return body(fieldName)
    .trim()
    .isLength({ min: 1, max: 24 })
    .withMessage(`Invalid ${fieldName} length. Expected length: 1-24`)
    .isAlphanumeric()
    .withMessage(`Invalid ${fieldName}. Only alphanumeric characters allowed`);
};

const checkNumber = (fieldName) => {
  return body(fieldName).trim().isNumeric().withMessage(`Invalid ${fieldName}`);
};

const checkPassword = (fieldName) => {
  return body(fieldName)
    .trim()
    .isLength({ min: 8, max: 24 })
    .withMessage(`Invalid ${fieldName} length. Expected length: 8-24`)
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage(
      `Invalid ${fieldName} format. Only letters (a-z, A-Z) and numbers (0-9) are allowed.`
    );
};

const checkEnum = (fieldName, enumValues) => {
  return body(fieldName)
    .trim()
    .isIn(enumValues)
    .withMessage(
      `Invalid ${fieldName} value. Expected values: ${enumValues.join(", ")}`
    );
};

const checkEmail = (fieldName) => {
  return body(fieldName).isEmail().withMessage(`Invalid email format`);
};

module.exports = {
  checkName,
  checkUsername,
  checkNumber,
  checkEnum,
  checkPassword,
  checkEmail,
};
