const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AccountSchema = new mongoose.Schema({
  accountHolder: {
    type: String,
    required: [true, "Please provide account holder name"],
  },
  accountBalance: {
    type: Number,
    default: 0.0,
  },
  accountNumber: {
    type: String,
    required: [true, "Please Provide account number"],
  },
  accountType: {
    type: String,
    required: [true, "Please provide account Type"],
    enum: {
      values: ["SAVINGS", "CURRENT"],
      msg: "{VALUE} is not supported",
    },
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: [true, "Please provide user"],
  },
  dateOpened: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Account", AccountSchema);
