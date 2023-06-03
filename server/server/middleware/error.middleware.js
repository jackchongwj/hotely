import errorHandler from '../helpers/errorHandler.js';

const errorMiddleware = (err, req, res, next) => {
  // Handle validation errors thrown by the `express-validator` library
  if (err.name === 'ValidationError') {
    const errors = err.errors.map(error => {
      return { message: error.msg };
    });
    return res.status(422).json({ errors });
  }

  // Handle other errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const error = errorHandler(statusCode, message);
  return res.status(statusCode).json({ error });
};

export default errorMiddleware;