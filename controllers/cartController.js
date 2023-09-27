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
