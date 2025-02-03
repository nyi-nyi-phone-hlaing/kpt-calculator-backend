const mongoose = require("mongoose");
const { param } = require("express-validator");

const checkMongooseId = (id) => {
  return param(id).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ID or "${id}" is not a valid ObjectId`);
    }
    return true;
  });
};

module.exports = checkMongooseId;
