const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


const updateAverageRating = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError(`Product with ${id} not found`, 404));
  }
  const reviews = await Review.find({ product: id });
  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  let averageRating = totalRatings / reviews.length;
  averageRating = Math.round((averageRating + Number.EPSILON) * 100) / 100;

  product.ratingsAverage = averageRating;
  await product.save();
};

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
