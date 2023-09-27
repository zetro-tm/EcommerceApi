const path = require('path');
const express = require('express');
const apicache = require('apicache');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = require('./swagger');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');

const app = express();

//1) GLOBAL MIDDLEWARES

dotenv.config({ path: './config.env' });
//Set security HTTP headers
app.use(helmet());

//logs requests to the terminal

app.use(morgan('dev'));

//Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  meesage: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser,reading data from the body to req.body
app.use(express.json({ limit: '20kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS(Cross site scripting attacks)
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['ratingsAverage', 'ratingsQuantity', 'price'],
  })
);

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/cart', cartRouter);

const specs = swaggerJsDoc(options);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Handling unhandled routes.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //whatever is passed into next() will be assumed as an err
});

app.use(globalErrorHandler);

module.exports = app;
