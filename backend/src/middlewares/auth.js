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

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
    } catch (e) {
      throw new AppError('Invalid or expired token', 401);
    }

    const user = await User.findById(payload.id).select('role status dept name email');

    if (!user || user.status !== 'Active') {
      throw new AppError('User is not authorized', 401);
    }

    req.user = { id: user._id.toString(), role: user.role, dept: user.dept, name: user.name, email: user.email };
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
      console.log('AUTHORIZE FAILED', { reqUser: req.user, allowedRoles, url: req.originalUrl, method: req.method });
      return next(new AppError('Access Denied', 403));
    }

    return next();
  };
}

module.exports = { authenticate, authorize };
