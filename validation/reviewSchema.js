const Joi = require('joi');

const createReview = Joi.object({
  review: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  product: Joi.string().required(),
  user: Joi.string().required(),
});

const updateReview = Joi.object({
  review: Joi.string(),
  rating: Joi.number().min(1).max(5),
  user: Joi.string(),
});

module.exports = {
  createReview,
  updateReview,
};
