const { query } = require("express-validator");

const checkSearchQuery = (q) => {
  return query(q).trim().isLength({ min: 1 }).withMessage("Required field");
};

module.exports = checkSearchQuery;
