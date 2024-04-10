const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const userSchema = require('../validation/userSchema');

const router = express.Router();

router.post('/signup', validate(userSchema.signup), authController.signup);
router.post('/login', validate(userSchema.login), authController.login);

router.post(
  '/forgotPassword',
  validate(userSchema.forgotPassword),
  authController.forgotPassword
);
router.patch(
  '/resetPassword/:token',
  validate(userSchema.resetPassword),
  authController.resetPassword
);

//Protected Routes
router.use(authController.protect);

router.patch(
  '/updateMyPassword',
  validate(userSchema.updateMyPassword),
  authController.updatePassword
);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  validate(userSchema.updateMe),
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

//Only for admin
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(validate(userSchema.updateUser), userController.updateUser);

module.exports = router;
