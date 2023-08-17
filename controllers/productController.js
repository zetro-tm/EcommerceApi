const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopProducts = (req, res, next) => {
  //Prefilling query string to get top 5 cheap tours
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'brand,name,price,ratingsAverage,product_type,color,description';
  // } catch (err) {
  //   console.log(err);
  // }
  next();
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  //1)Filtering
  // const queryObj = { ...req.query }; //hard copy of the query string
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // //1B) Advanced filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //searches for exact matches of the strings. 'b' makes sure that only exact mathces are found. 'g' menas that it will check for multiple occurences, not just one. .replace() accepts a callback function. in the callback fn , for each match, a dollar sign is added.

  // let query = Product.find(JSON.parse(queryStr)); //Product.find() returns a query. It is stored in variable 'query'

  //2)Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  //3) FIELD LIMITING
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v'); // '-' is to exclude
  // }

  //4)PAGINATION
  // const page = req.query.page * 1 || 1; // * 1 converts a string to a number '   '||' is for setting default
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit; // calculating the number if results we want to skip based on the page requested

  // query = query.skip(skip).limit(limit); //limit defines the amount of results we want in a query. Skip defines the amount of results to be skipped before querying data

  // if (req.query.page) {
  //   const numProducts = await Product.countDocuments();
  //   if (skip >= numProducts) throw new Error('This page does not exist'); //executes if we are trying to skip more documents than we actually have
  // }

  //EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(); //creating an instance of APIFeatures and then calling the methods

  const products = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404)); // return next function immediately and not send another response
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  //Product.create() returns a promise
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //updated document will be returned rather than the original
    runValidators: true, //runs the schema validators
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404)); // return next function immediately and not send another response
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  console.log(req.params.id);
  console.log(product);

  if (!product) {
    return next(new AppError('No product found with that ID', 404)); // return next function immediately and not send another response
  }
  await Product.deleteOne(product);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$brand',
        numProducts: { $sum: 1 }, //for each document that goes through the pipline, 1 will be added
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' }, // '$' is added to specify the field to calculate the average from
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // at this stage, the new document is the result of the group stage. So the fields that can be used are the ones specified in the group stage
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});
