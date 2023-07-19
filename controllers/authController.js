const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // the payload(an object containing data),the jwt secret, options.
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body; //Object destructuring

  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); //use select to include other fields;

  if (!user || !user.correctPassword(password, user.password)) {
    //check if user exists and if password is correct
    //.correctPassword() is availabe to 'user' because user is a document
    return next(new AppError('Incorrect email or password', 401)); //401 : unauthorised
  }

  //3) If everything ok, send token to client

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Get token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //authorization: 'Bearer wwwwww'

    token = req.headers.authorization.split(' ')[1]; // split the value of the header to get the second part which is the token
  }

  if (!token) {
    return new AppError(
      'You are not logged in! Please log in to get access',
      401
    );
  }

  //2) Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //promisify makes a function return a promise

  //3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  //4) Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  } //decoded.iat is the JWTTimestamp

  //Grant access to protected route
  req.user = freshUser; //Put user data on the request
  next();
});

//arguments can't be passed into middlewares. To pass arguments, a wrapper function is used

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'store-owner']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      ); //403 : forbidden
    }
    next();
  };
};
