const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .post(cartController.addToCart)
  .get(cartController.getUserCart)
  .delete(cartController.clearCart);

router
  .route('/:id')
  .patch(cartController.updateCart)
  .delete(cartController.removeItem);

module.exports = router;
