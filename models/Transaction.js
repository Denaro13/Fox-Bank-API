const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: "NGN",
  },
  transactionType: {
    type: String,
  },
  receiverAccountNumber: {
    type: String,
    default: null,
  },
  receiverFullName: {
    type: String,
    default: null,
  },
  senderAccountNumber: {
    type: String,
    default: null,
  },
  senderFullName: {
    type: String,
    default: null,
  },
  transactionAmount: {
    type: String,
  },
  transactionDate: {
    type: Date,
    default: new Date(),
  },
  receiverAccountId: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
    default: null,
  },
  senderAccountId: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
    default: null,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
