const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const { updateAverageRating } = require('../utils/averageRatingCalculator');

exports.setProductUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);
  await review.save();
  await updateAverageRating(review.product);

  res.status(201).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
