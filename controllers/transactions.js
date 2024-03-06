const Account = require("../models/Account");
const Transaction = require("../models/transaction");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const PDFDocument = require("pdfkit");

const getReceipt = async (req, res) => {
  const { transactionId } = req.params;
  const transaction = await Transaction.findById({ _id: transactionId });

  const {
    transactionDate,
    transactionAmount,
    senderFullName,
    receiverFullName,
    transactionType,
  } = transaction;

  const doc = new PDFDocument();
  doc.pipe(res);
  doc
    .fontSize(24)
    .text("Liberty Bank Transaction Receipt", { align: "center" })
    .moveDown(1)
    .fontSize(18)
    .text(`Transaction ID: ${transactionId}`)
    .moveDown(0.5)
    .text(`Transaction Date: ${transactionDate}`)
    .moveDown(0.5)
    .text(`Transaction Amount: ${transactionAmount}`)
    .moveDown(0.5);
  {
    senderFullName && doc.text(`Sender: ${senderFullName}`).moveDown(0.5);
  }

  {
    receiverFullName && doc.text(`Receiver: ${receiverFullName}`).moveDown(0.5);
  }
  doc
    .text(`${transactionType} Amount: ${transactionAmount}`)
    .moveDown(0.5)
    .text("Currency: NGN");

  doc.end();
  res.doc;
};

const deposit = async (req, res) => {
  const { acctNumber, depositAmt } = req.body;

  if (acctNumber === "" || depositAmt === "") {
    throw new BadRequestError("AcctNumber or depositAmt cannot be empty");
  }
  if (!acctNumber || !depositAmt) {
    throw new BadRequestError("Please provide acctNumber and depositAmt");
  }
  const accountHolder = await Account.findOne({ accountNumber: acctNumber });
  if (!accountHolder) {
    throw new NotFoundError(
      `There is no account holder with account number: ${acctNumber}`
    );
  }

  await Account.findOneAndUpdate(
    { accountNumber: acctNumber },
    { accountBalance: accountHolder.accountBalance + parseInt(depositAmt) }
  );
  await Transaction.create({
    transactionType: "Deposit",
    receiverAccountNumber: acctNumber,
    receiverFullName: accountHolder.accountHolder,
    transactionAmount: depositAmt,
    receiverAccountId: accountHolder._id,
  });
  res.status(StatusCodes.OK).json({
    msg: `A sum of ${depositAmt} naira has been added to account number: ${acctNumber}`,
  });
};

const withdraw = async (req, res) => {
  const { acctNumber, withdrawalAmt } = req.body;

  if (acctNumber === "" || withdrawalAmt === "") {
    throw new BadRequestError("AcctNumber or withdrawalAmt cannot be empty");
  }
  if (!acctNumber || !withdrawalAmt) {
    throw new BadRequestError("Please provide acctNumber and withdrawalAmt");
  }
  const accountHolder = await Account.findOne({
    accountNumber: acctNumber,
  });

  if (!accountHolder) {
    throw new NotFoundError(
      `There is no account holder with account number: ${acctNumber}`
    );
  }

  if (accountHolder.accountBalance - withdrawalAmt < 0) {
    throw new BadRequestError("Insufficient funds");
  }

  await Account.findOneAndUpdate(
    { accountNumber: acctNumber },
    { accountBalance: accountHolder.accountBalance - parseInt(withdrawalAmt) }
  );

  await Transaction.create({
    transactionType: "Withdrawal",
    receiverAccountNumber: acctNumber,
    receiverFullName: accountHolder.accountHolder,
    transactionAmount: withdrawalAmt,
    receiverAccountId: accountHolder._id,
  });

  res.status(StatusCodes.OK).json({
    msg: `A sum of ${withdrawalAmt} naira has been withdrawn from account number: ${acctNumber}`,
  });
};

const transfer = async (req, res) => {
  const { senderAcctNumber, receiverAcctNumber, transactionAmt } = req.body;
  if (
    senderAcctNumber === "" ||
    receiverAcctNumber === "" ||
    transactionAmt === ""
  ) {
    throw new BadRequestError(
      "senderAcctNumber or receiverAcctNumber or transactionAmt cannot be empty"
    );
  }
  if (!senderAcctNumber || !receiverAcctNumber || !transactionAmt) {
    throw new BadRequestError(
      "Please provide senderAcctNumber and receiverAcctNumber and transactionAmt"
    );
  }
  const sender = await Account.findOne({ accountNumber: senderAcctNumber });
  const receiver = await Account.findOne({ accountNumber: receiverAcctNumber });
  if (!sender || !receiver) {
    throw new NotFoundError("Please provide valid account numbers");
  }
  const amount = parseInt(transactionAmt);
  const senderBalance = sender.accountBalance - amount;

  if (senderBalance < 0) {
    throw new BadRequestError("Insufficient funds");
  }

  await Account.findOneAndUpdate(
    { accountNumber: senderAcctNumber },
    { accountBalance: sender.accountBalance - amount }
  );
  await Account.findOneAndUpdate(
    { accountNumber: receiverAcctNumber },
    { accountBalance: receiver.accountBalance + amount }
  );

  await Transaction.create({
    transactionType: "Transfer",
    receiverAccountNumber: receiverAcctNumber,
    receiverFullName: receiver.accountHolder,
    senderAccountNumber: senderAcctNumber,
    senderFullName: sender.accountHolder,
    transactionAmount: transactionAmt,
    receiverAccountId: receiver._id,
    senderAccountId: sender._id,
  });
  res.status(StatusCodes.OK).json({
    msg: `A sum of ${amount} naira has been sent to account number: ${receiverAcctNumber}`,
  });
};

module.exports = { getReceipt, deposit, withdraw, transfer };
