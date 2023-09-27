const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, cartController.addToCart)
  .get(authController.protect, cartController.getUserCart);

module.exports = router;
