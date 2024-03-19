const express = require("express");
const router = express.Router();
const {
  getReceipt,
  deposit,
  withdraw,
  transfer,
  getTransactions,
} = require("../controllers/transactions");

router.route("/").get(getTransactions);
router.route("/deposit").post(deposit);
router.route("/withdraw").post(withdraw);
router.route("/transfer").post(transfer);
router.route("/receipt/:transactionId").get(getReceipt);

module.exports = router;
