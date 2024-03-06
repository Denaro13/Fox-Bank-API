const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const { faker } = require("@faker-js/faker");
const { BadRequestError } = require("../errors");

const createAccount = async (req, res) => {
  const user = req.user;
  const accountNumber = faker.string.numeric(10);
  req.body.accountNumber = accountNumber;
  req.body.accountHolder = user.name;
  req.body.userId = user.userId;

  const account = await Account.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ account });
};

module.exports = {
  createAccount,
};
