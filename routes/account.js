const express = require("express");
const router = express.Router();
const { getAccount, createAccount } = require("../controllers/account");

router.route("/").post(createAccount);
router.route("/:userId").get(getAccount);

module.exports = router;
