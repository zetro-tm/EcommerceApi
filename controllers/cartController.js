const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/cartModel');

exports.addToCart = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  //   if (req.body) {
  //     return next(new AppError('Invalid request', 400));
  //   }
  req.body.user = req.user._id;
  const { user, product, quantity } = req.body;
  let cart = await Cart.findOne({ user });
  if (!cart) {
    cart = new Cart({ user, products: [] });
  }

  //Check if product already exists in the cart
  const existingProduct = cart.products.find((item) =>
    item.product.equals(product)
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ product, quantity });
  }
  await cart.save();

  await cart.populate('products.product', 'name price brand images');
  // .execPopulate();

  res.status(201).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.getUserCart = catchAsync(async (req, res, next) => {
  const user = req.user._id;

  let cart = await Cart.findOne({ user });

  if (!cart) {
    cart = new Cart({ user, products: [] });
    await cart.save();
  }
  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const product = req.params.id;
  const { quantity } = req.body;

  if (!quantity) {
    return next(new AppError('Please enter a quantity', 400));
  }

  const cart = await Cart.findOne({ user }).select('-user');

  const productIndex = cart.products.findIndex((item) =>
    item.product.equals(product)
  );

  if (productIndex !== -1) {
    cart.products[productIndex].quantity = quantity;

    if (cart.products[productIndex].quantity === 0) {
      // if quantity is zero, remove item
      cart.products.splice(productIndex, 1);
    }

    await cart.save();

    res.status(200).json({
      status: 'success',
      data: {
        cart,
      },
    });
  } else {
    return next(new AppError('Product not found in cart', 404));
  }
});

exports.removeItem = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const product = req.params.id;

  const cart = await Cart.findOneAndUpdate(
    { user },
    {
      $pull: { products: { product } }, // Remove the product from the array
    },
    { new: true } // Return the updated cart
  );

  if (!cart) {
    return next(new AppError('Product not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const user = req.user._id;

  const result = await Cart.findOneAndDelete({ user });

  if (result === null) {
    return next(new AppError('Cart has already been emptied', 404));
  } else {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
});
