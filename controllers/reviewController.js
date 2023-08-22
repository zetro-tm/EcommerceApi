const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const apiFeatures = require('../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId }; //find reviews of a specific tour

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    data: {
      results: reviews.length,
      data: {
        reviews,
      },
    },
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review with that ID found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
