const mongoose = require('mongoose');
const Product = require('./productModel');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products.product',
    select: ' brand name price',
  });

  next();
});

module.exports = mongoose.model('Cart', cartSchema);
