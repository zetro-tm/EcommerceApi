const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
const AppError = require('../utils/appError');
const Review = require('./reviewModel');

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // validate: [
      //   validator.isAlpha,
      //   'Product name must only contain characters',
      // ],
    },
    slug: String,
    // image: {
    //   type: String,
    // },
    description: {
      type: String,
      required: true,
      trim: true,
      // maxlength: [
      //   75,
      //   'Description must have less than or equal to 75 characters',
      //  ],
    },
    color: {
      type: String,
    },
    category: {
      type: Array,
    },
    product_type: {
      type: String,
    },
    tag_list: {
      type: Array,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less than or equal to 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    // size:{
    //     type:String
    // }
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to crrent doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price should be below actual price',
      },
    },
    productOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //excludes it from the data being sent
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//VIRTUAL POPULATE
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id', // specify where the review is stored in the current model
  foreignField: 'product', //specify where the id is stored in the review model
});

//DOCUMENT MIDDLEWARE: runs before only .save() and .create()
productSchema.pre('save', function (next) {
  // 'this' points to the current document being processed
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre('save', async function (next) {
  this.productOwner = await User.findById(this.productOwner);

  next();
});

//QUERY MIDDLEWARE
productSchema.pre(/^find/, function (next) {
  //  /^find/ is for all commands that have find
  //processing queries
  this.start = Date.now();
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'productOwner',
    select: '-createdAt -updatedAt -__v',
  }); // Populating the productOwner field
  next();
});

productSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
// productSchema.pre('aggregate', function(next){

//   next()
// })

module.exports = mongoose.model('Product', productSchema);
