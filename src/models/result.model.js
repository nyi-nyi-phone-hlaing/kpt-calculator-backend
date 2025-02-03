const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
    morning: { type: Number, required: true },
    evening: { type: Number, required: true },
    morning_win: { type: Number, required: true },
    evening_win: { type: Number, required: true },
    commission: { type: Number, required: true },
    gameX: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: String, required: true },
    formerCustomerName: { type: String, default: "" },
    customer_details: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
