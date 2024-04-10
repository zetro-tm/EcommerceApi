const Joi = require('joi');

const createProduct = Joi.object({
  brand: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  color: Joi.string(),
  category: Joi.array().items(Joi.string()),
  product_type: Joi.string(),
  tag_list: Joi.array(),
  images: Joi.array().items(Joi.string()),
  ratingsAverage: Joi.number().min(1).max(5),
  ratingsQuantity: Joi.number(),
  price: Joi.number().required(),
  priceDiscount: Joi.number(),
});

const updateProduct = Joi.object({
  brand: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  color: Joi.string(),
  category: Joi.array().items(Joi.string()),
  product_type: Joi.string(),
  tag_list: Joi.array(),
  images: Joi.array().items(Joi.string()),
  ratingsAverage: Joi.number().min(1).max(5),
  ratingsQuantity: Joi.number(),
  price: Joi.number(),
  priceDiscount: Joi.number(),
});

module.exports = {
  createProduct,
  updateProduct,
};
