const path = require('path');
const express = require('express');
const apicache = require('apicache');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');

const app = express();

// let cache = apicache.middleware;
// app.use(cache('5 minutes'));

//1) GLOBAL MIDDLEWARES

//logs requests to the terminal
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  meesage: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser,reading data from the body to req.body
app.use(express.json());

// app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

//Handling unhandled routes.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //whatever is passed into next() will be assumed as an err
});

app.use(globalErrorHandler);

module.exports = app;
