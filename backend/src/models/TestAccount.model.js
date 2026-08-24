const mongoose = require('mongoose');

/**
 * TestAccount — temporary read-only credentials issued by Admin
 * so that an external person (e.g. a board member, evaluator, or demo
 * scholar) can log in without a full user account.
 *
 * Each test account maps to a REAL scholar user so the tester sees
 * live data for that scholar.
 */
const testAccountSchema = new mongoose.Schema(
  {
    // Human-readable test ID, e.g. "TEST-001"
    testId: { type: String, required: true, unique: true, trim: true, uppercase: true },

    // Plain-text password shown only to admin
    testPassword: { type: String, required: true, trim: true },

    // The real scholar User this test account mirrors
    scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Label so admin remembers what this account is for
    label: { type: String, trim: true, default: '' },

    // Active / Revoked
    status: { type: String, enum: ['Active', 'Revoked'], default: 'Active' },

    // Optional expiry — leave null for no expiry
    expiresAt: { type: Date, default: null },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestAccount', testAccountSchema, 'test_accounts');
