const { query } = require("express-validator");

const checkDateFormat = (q) => {
  return query(q)
    .trim()
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/)
    .withMessage(`${q} is invalid date format. Expected format: DD/MM/YYYY`);
};

module.exports = checkDateFormat;
