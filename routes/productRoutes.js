const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

/**
 * @swagger
 * tags:
 *    name: Products
 *    description: API endpoint to manage products
 *
 */

/**
 * @swagger
 *    /products:
 *        get:
 *            summary: Get all products
 *            tags: [Producs]
 *            responses:
 *                "200":
 *                    description: The list of products
 *                    contents:
 *                        application/json:
 *                            schema:
 *                                $ref: '#/components/schemas/Product'
 *                "400":
 *                    $ref: '#/components/responses/400'
 *                "404":
 *                    $ref: '#/components/responses/404'
 *
 *
 *
 */
router
  .route('/top-5-cheap')
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route('/product-stats').get(productController.getProductStats);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

//Simple nested route Bad practice
// router
//   .route('/:productId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

module.exports = router;
