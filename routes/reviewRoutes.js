const reviewController = require('../controllers/reviewController');
const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const reviewSchema = require('../validation/reviewSchema');

const router = express.Router({ mergeParams: true }); //merge params enables access to params of other routers

router.use(authController.protect);
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(validate(reviewSchema.updateReview), reviewController.updateReview);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setProductUserIds,
    validate(reviewSchema.createReview),
    reviewController.createReview
  );

module.exports = router;
