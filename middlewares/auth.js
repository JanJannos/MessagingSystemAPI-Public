const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const colors = require('colors');

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // if user didn't use Bearer Token in his request
    // we can uncomment this code and pull the token
    // from the cookie (notice that the user must at least once use the token in his
    // Bearer request , and then he can cancel it)

    // ...
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    console.log('You have no token!');
    return next(new ErrorResponse('Not authorized to access this route!', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`decoded : ${decoded}`);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        'Not authorized to access this route! , Reason : ' + error,
        401
      )
    );
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // error
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route!`,
          403
        )
      );
    }
    next();
  };
};
