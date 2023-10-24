const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // the payload(an object containing data),the jwt secret, options.
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true, //Ensures tha the cookie cannot be changed or modified by the browser
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  user.password = undefined; // Remove password from output

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body; //Object destructuring

  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); //use select to include other fields;

  if (!user || !(await user.correctPassword(password, user.password))) {
    //check if user exists and if password is correct
    //.correctPassword() is availabe to 'user' because user is a document
    return next(new AppError('Incorrect email or password', 401)); //401 : unauthorised
  }

  //3) If everything ok, send token to client
  createSendToken(user, 200, res);
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
  console.log(token);
  if (!token || token === undefined) {
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email }); //find user based on email
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }
  //2) Generate the random reset password

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3)Send to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n If you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the  reset token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }); //use the query to find the user by the reset token and check if it has expired using $gt

  //2) If token has not expired,and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3) Update the changedPasswordAt property for the user

  //4) Log the user in, send JWT
  createSendToken(user, 200, res);
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Current password is incorrect!', 401));
  }

  //3) If so, update password

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  //4)Log user in, send JWT
  createSendToken(user, 200, res);
});
