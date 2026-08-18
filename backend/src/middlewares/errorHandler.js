class AppError extends Error {
  /**
   * Creates an operational application error.
   * @param {string} message Error message.
   * @param {number} statusCode HTTP status code.
   * @param {Array<object>} errors Optional validation details.
   */
  constructor(message, statusCode = 500, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
}

/**
 * Wraps async route handlers and forwards errors to Express.
 * @param {Function} fn Async handler.
 * @returns {Function}
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  const errors = err.errors
    ? Object.values(err.errors).map((error) => ({ field: error.path, message: error.message }))
    : undefined;

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(errors ? { errors } : {}),
    ...(err.errors && Array.isArray(err.errors) ? { errors: err.errors } : {})
  });
}

module.exports = { AppError, asyncHandler, notFound, errorHandler };
