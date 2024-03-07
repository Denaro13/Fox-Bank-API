const { NotFoundError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  const formattedUsers = users.map((user) => {
    const { _id, firstName, lastName, phoneNumber, role } = user;
    return { _id, firstName, lastName, phoneNumber, role };
  });
  res
    .status(StatusCodes.OK)
    .json({ users: formattedUsers, count: formattedUsers.length });
};

const getUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`There is no user with id: ${userId}`);
  }

  const {
    _id,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    address,
    dateJoined,
  } = user;
  res.status(StatusCodes.OK).json({
    user: {
      userId: _id,
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      address,
      dateJoined,
    },
  });
};

module.exports = {
  getAllUsers,
  getUser,
};
