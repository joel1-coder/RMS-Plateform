const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('./errorHandler');

/**
 * Authenticates a Bearer JWT and attaches `{ id, role }` to `req.user`.
 * @returns {Function}
 */
function authenticate() {
  return asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Missing or invalid Authorization header', 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
    const user = await User.findById(payload.id).select('role status');

    if (!user || user.status !== 'Active') {
      throw new AppError('User is not authorized', 401);
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  });
}

/**
 * Authorizes users by role.
 * @param {string[]} allowedRoles Allowed role names.
 * @returns {Function}
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access Denied', 403));
    }

    return next();
  };
}

module.exports = { authenticate, authorize };
