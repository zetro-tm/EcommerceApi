const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

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

module.exports = { updateAverageRating };
