const TestAccount = require('../models/TestAccount.model');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');
const { signToken } = require('./auth.controller');

/**
 * POST /api/test-accounts/login
 * Public — validates testId + testPassword and returns a JWT for the linked scholar.
 */
const testLogin = asyncHandler(async (req, res) => {
  const { testId, testPassword } = req.body;

  if (!testId || !testPassword) {
    throw new AppError('Test ID and password are required', 400);
  }

  const account = await TestAccount.findOne({
    testId: testId.trim().toUpperCase(),
    status: 'Active',
  }).populate('scholarId');

  if (!account) {
    throw new AppError('Invalid Test ID or the account has been revoked', 401);
  }

  // Check expiry
  if (account.expiresAt && account.expiresAt < new Date()) {
    throw new AppError('This test account has expired. Please contact the Admin.', 401);
  }

  // Plain-text password comparison (intentionally simple for test accounts)
  if (account.testPassword !== testPassword.trim()) {
    throw new AppError('Incorrect test password', 401);
  }

  const scholar = account.scholarId;
  if (!scholar || scholar.status !== 'Active') {
    throw new AppError('The scholar linked to this test account is inactive', 401);
  }

  res.json({
    token: signToken(scholar),
    user: {
      id: scholar._id,
      email: scholar.email,
      name: scholar.name,
      role: scholar.role,
      dept: scholar.dept,
      isProfileCompleted: scholar.isProfileCompleted,
      profile: scholar.profile,
      assignedSupervisor: scholar.assignedSupervisor,
      assignedSupervisorId: scholar.assignedSupervisorId,
      isTestAccount: true,
      testLabel: account.label,
    },
  });
});

/**
 * GET /api/test-accounts
 * Admin only — list all test accounts.
 */
const listTestAccounts = asyncHandler(async (req, res) => {
  const accounts = await TestAccount.find()
    .populate('scholarId', 'name email dept profile')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json({ data: accounts });
});

/**
 * POST /api/test-accounts
 * Admin only — create a new test account.
 */
const createTestAccount = asyncHandler(async (req, res) => {
  const { testId, testPassword, scholarId, label, expiresAt } = req.body;

  // Verify scholar exists
  const scholar = await User.findById(scholarId);
  if (!scholar || scholar.role !== 'scholar') {
    throw new AppError('Scholar not found', 404);
  }

  const account = await TestAccount.create({
    testId: testId.trim().toUpperCase(),
    testPassword: testPassword.trim(),
    scholarId,
    label: label || '',
    expiresAt: expiresAt || null,
    createdBy: req.user.id,
  });

  res.status(201).json({ message: 'Test account created', data: account });
});

/**
 * PATCH /api/test-accounts/:id/revoke
 * Admin only — revoke a test account.
 */
const revokeTestAccount = asyncHandler(async (req, res) => {
  const account = await TestAccount.findByIdAndUpdate(
    req.params.id,
    { status: 'Revoked' },
    { new: true }
  );
  if (!account) throw new AppError('Test account not found', 404);
  res.json({ message: 'Test account revoked', data: account });
});

/**
 * DELETE /api/test-accounts/:id
 * Admin only — permanently delete a test account.
 */
const deleteTestAccount = asyncHandler(async (req, res) => {
  const account = await TestAccount.findByIdAndDelete(req.params.id);
  if (!account) throw new AppError('Test account not found', 404);
  res.json({ message: 'Test account deleted' });
});

module.exports = { testLogin, listTestAccounts, createTestAccount, revokeTestAccount, deleteTestAccount };
