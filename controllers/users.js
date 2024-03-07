const { NotFoundError, UnauthenticatedError } = require("../errors");
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
const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const admin = await User.findOne({ _id: userId });
  if (admin.role !== "ADMIN") {
    throw new UnauthenticatedError("Not authorized to delete user account");
  }
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new NotFoundError(`There is no user with id: ${id}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
};
