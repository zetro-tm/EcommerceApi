const fs = require('fs');
const path = require('path');
const express = require('express');
const apicache = require('apicache');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');

const app = express();

// let cache = apicache.middleware;
// app.use(cache('5 minutes'));

//Body parser,reading data from the body to req.body
app.use(express.json());

//logs requests to the terminal
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

//Handling unhandled routes.
app.all('*', (req, res, next) => {
  // '*' is for everything

  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //whatever is passed into next() will be assumed as an err
});

app.use(globalErrorHandler);

module.exports = app;
