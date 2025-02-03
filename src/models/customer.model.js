const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
    commission: { type: Number, required: true },
    gameX: { type: Number, required: true },
    type: { type: String, required: true, enum: ["In", "Out", "Both"] },
    payType: { type: String, required: true, enum: ["Daily", "Weekly"] },
    date: { type: String, required: true },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
