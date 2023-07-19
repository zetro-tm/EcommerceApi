const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404)); // return next function immediately and not send another response
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
