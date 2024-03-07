const express = require("express");
const router = express.Router();
const { getUserAccounts, createAccount } = require("../controllers/account");

router.route("/").post(createAccount);
router.route("/:userId").get(getUserAccounts);

module.exports = router;
