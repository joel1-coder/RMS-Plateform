const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET || 'development-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

/**
 * Authenticates a user and returns a JWT plus profile data.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

  if (!user || user.role !== role || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email, password, or role mismatched', 401);
  }

  if (user.status !== 'Active') {
    throw new AppError('User account is inactive', 401);
  }

  res.json({
    token: signToken(user),
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      dept: user.dept,
      isProfileCompleted: user.isProfileCompleted,
      profile: user.profile
    }
  });
});

module.exports = { login, signToken };
