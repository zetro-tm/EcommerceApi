const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
    },
    rating: {
      type: Number,
      require: true,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less than or equal to 5.0'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true }); //ensures there is only one combination of product and user.0258+858+5

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: ' username',
  });

  // this.populate({
  //   path: 'product',
  //   select: ' brand name color',
  // });
  next();
});

// reviewSchema.statics.calcAverageRatings = async function (productId) {
//   const stats = await this.aggregate([
//     {
//       $match: { product: productId },
//     },
//     {
//       $group: {
//         _id: '$product',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' },
//       },
//     },
//   ]);
//   if (stats.length > 0) {
//     await Product.findByIdAndUpdate(productId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating,
//     });
//   } else {
//     await Product.findByIdAndUpdate(productId, {
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5,
//     });
//   }
// };

// reviewSchema.post('save', function () {
//   this.constructor.calcAverageRatings(this.product);
// });
module.exports = mongoose.model('Review', reviewSchema);
