const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage(); //store the file in the memory as buffer

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.array('images', 4); //multiple wih the same field

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  // console.log(req.files); //for multiple requests it is 'req.files'
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`data/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

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

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: 'reviews' });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

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
