const TestAccount = require('../models/TestAccount.model');
const User = require('../models/User.model');
const RegistrationSubmission = require('../models/RegistrationSubmission.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');
const { signToken } = require('./auth.controller');
const { sendTestCredentials } = require('../services/emailService');

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
  });

  if (!account) {
    throw new AppError('Invalid Test ID or the account has been revoked', 401);
  }

  // Check expiry
  if (account.expiresAt && account.expiresAt < new Date()) {
    throw new AppError('This test account has expired. Please contact the Admin.', 401);
  }

  // Plain-text password comparison
  if (account.testPassword !== testPassword.trim()) {
    throw new AppError('Incorrect test password', 401);
  }

  res.json({
    token: signToken({ _id: account._id, role: 'scholar', status: 'Active' }),
    user: {
      id: account._id,
      email: account.applicantEmail,
      name: account.applicantName,
      role: 'scholar',
      dept: 'Unknown',
      isProfileCompleted: false,
      profile: {},
      assignedSupervisor: null,
      assignedSupervisorId: null,
      isTestAccount: true,
      testAccountId: account._id,
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
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json({ data: accounts });
});

/**
 * POST /api/test-accounts
 * Admin only — create a new test account and auto-email credentials.
 */
const createTestAccount = asyncHandler(async (req, res) => {
  const { testId, testPassword, applicantName, applicantEmail, label, expiresAt } = req.body;

  if (!expiresAt) {
    throw new AppError('Expiry date is required for all test accounts', 400);
  }
  if (!applicantName || !applicantEmail) {
    throw new AppError('Applicant name and email are required', 400);
  }

  const account = await TestAccount.create({
    testId: testId.trim().toUpperCase(),
    testPassword: testPassword.trim(),
    applicantName: applicantName.trim(),
    applicantEmail: applicantEmail.trim().toLowerCase(),
    label: label || '',
    expiresAt,
    createdBy: req.user.id,
  });

  // Auto-send credentials to the scholar's email (non-blocking)
  sendTestCredentials({
    to: account.applicantEmail,
    name: account.applicantName,
    testId: account.testId,
    testPassword: account.testPassword,
    expiresAt: account.expiresAt,
    label: account.label,
  }).catch(err => {
    console.error('[TestAccount] Email send failed:', err.message);
  });

  res.status(201).json({
    message: `Test account created. Credentials auto-sent to ${account.applicantEmail}`,
    data: account,
  });
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

/* ─── Registration Submissions ─────────────────────────────────── */

/**
 * POST /api/test-accounts/submit-registration
 * Scholar (test account) — submit their filled registration form.
 */
const submitRegistration = asyncHandler(async (req, res) => {
  const { testAccountId, formData } = req.body;
  const scholarId = req.user.id;

  // Upsert: one submission per scholar
  const existing = await RegistrationSubmission.findOne({ scholarId });
  if (existing) {
    existing.formData = formData;
    existing.status = 'Pending';
    existing.testAccountId = testAccountId;
    await existing.save();
    return res.json({ message: 'Registration updated successfully', data: existing });
  }

  const submission = await RegistrationSubmission.create({
    scholarId,
    testAccountId,
    formData,
    status: 'Pending',
  });

  res.status(201).json({ message: 'Registration submitted successfully', data: submission });
});

/**
 * GET /api/test-accounts/registrations
 * Admin only — list all pending/submitted registrations.
 */
const listRegistrations = asyncHandler(async (req, res) => {
  const submissions = await RegistrationSubmission.find()
    .populate('scholarId', 'name email dept assignedSupervisor')
    .sort({ createdAt: -1 });
  res.json({ data: submissions });
});

/**
 * PATCH /api/test-accounts/registrations/:id/approve
 * Admin only — approve a registration submission.
 */
const approveRegistration = asyncHandler(async (req, res) => {
  const submission = await RegistrationSubmission.findByIdAndUpdate(
    req.params.id,
    { status: 'Approved', approvedAt: new Date(), approvedBy: req.user.id },
    { new: true }
  ).populate('scholarId', 'name email dept');
  if (!submission) throw new AppError('Submission not found', 404);
  res.json({ message: 'Registration approved', data: submission });
});

/**
 * PATCH /api/test-accounts/registrations/:id/reject
 * Admin only — reject a registration submission.
 */
const rejectRegistration = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const submission = await RegistrationSubmission.findByIdAndUpdate(
    req.params.id,
    { status: 'Rejected', rejectionReason: reason || '', approvedAt: new Date() },
    { new: true }
  ).populate('scholarId', 'name email dept');
  if (!submission) throw new AppError('Submission not found', 404);
  res.json({ message: 'Registration rejected', data: submission });
});

/**
 * GET /api/test-accounts/my-registration
 * Scholar (authenticated) — get their own registration submission.
 */
const getMyRegistration = asyncHandler(async (req, res) => {
  const scholarId = req.user.id;
  const submission = await RegistrationSubmission.findOne({ scholarId });
  res.json({ data: submission || null });
});

module.exports = {
  testLogin,
  listTestAccounts,
  createTestAccount,
  revokeTestAccount,
  deleteTestAccount,
  submitRegistration,
  listRegistrations,
  approveRegistration,
  rejectRegistration,
  getMyRegistration,
};
