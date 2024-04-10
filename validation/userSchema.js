const Joi = require('joi');

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signup = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});

const updateMe = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  photo: Joi.string(),
});

const updateUser = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  photo: Joi.string(),
  role: Joi.string(),
  active: Joi.boolean(),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

const resetPassword = Joi.object({
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});

const updateMyPassword = Joi.object({
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});

module.exports = {
  login,
  signup,
  updateMe,
  updateUser,
  forgotPassword,
  resetPassword,
  updateMyPassword,
};
