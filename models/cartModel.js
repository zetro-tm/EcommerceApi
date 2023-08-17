const mongoose = require('mongoose');
const Product = require('./productModel');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  items: Array,
});
