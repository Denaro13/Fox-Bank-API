const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const { faker } = require("@faker-js/faker");
const { BadRequestError, NotFoundError } = require("../errors");

const getUserAccounts = async (req, res) => {
  const { userId } = req.params;
  const accounts = await Account.find({ userId: userId }).sort("dateOpened");

  res.status(StatusCodes.OK).json({ accounts, count: accounts.length });
};

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
  getUserAccounts,
  createAccount,
};
