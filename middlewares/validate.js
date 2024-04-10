const AppError = require('../utils/appError');

const validate = (schema) => async (req, res, next) => {
  try {
    const { body } = req;
    await schema.validateAsync(body);
    next();
  } catch (err) {
    console.log(err.details);
    next(new AppError(err.details[0].message, 406));
  }
};

module.exports = validate;
