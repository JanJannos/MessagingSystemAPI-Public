const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */

exports.register = asyncHandler(async (req, res, next) => {
  console.log('Registering ...', req.body);

  const { name, email, password, role } = req.body;
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials!', 400));
  } else {
    console.log('Found the user!');
  }

  //   Check if password is match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials!', 400));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get current logged-in user
 * @route   POST /api/v1/auth/me
 * @access  Private
 */

exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user; // the logged in user
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Logout user
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */

exports.logout = asyncHandler(async (req, res, next) => {
  console.log('I am here!');
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 2 * 1000), // expires in 2 sec
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// A Helper - Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // only for client side
  };

  if (process.env.NOVE_ENV === 'production') {
    options.secure = true; // The cookie will be sent over HTTPS
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
