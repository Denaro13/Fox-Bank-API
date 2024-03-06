const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  // const date = new Date(year, month, day);
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  const {
    _id: userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    dateJoined,
    role,
  } = user;
  res.status(StatusCodes.CREATED).json({
    user: {
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      dateJoined,
      role,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("invalid credentials");
  }
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new UnauthenticatedError("invalid credentials");
  }
  const token = await user.createJWT();

  const {
    _id: userId,
    firstName,
    lastName,
    phoneNumber,
    address,
    dateJoined,
    role,
  } = user;

  res.status(StatusCodes.OK).json({
    user: {
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      dateJoined,
      role,
    },
    token,
  });
};

module.exports = {
  register,
  login,
};
