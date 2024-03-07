const express = require("express");
const { getAllUsers, getUser, deleteUser } = require("../controllers/users");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).delete(deleteUser);

module.exports = router;
