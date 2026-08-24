const express = require('express');
const {
  testLogin,
  listTestAccounts,
  createTestAccount,
  revokeTestAccount,
  deleteTestAccount,
  submitRegistration,
  listRegistrations,
  approveRegistration,
  rejectRegistration,
  getMyRegistration
} = require('../controllers/testAccount.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// PUBLIC — test login (no JWT required)
router.post('/login', testLogin);

// Scholar (logged in via test login) — submit & view registration details
router.post('/submit-registration', authenticate(), submitRegistration);
router.get('/my-registration', authenticate(), getMyRegistration);

// ADMIN ONLY — manage test accounts and approve registrations
router.get('/', authenticate(), authorize(['admin']), listTestAccounts);
router.post('/', authenticate(), authorize(['admin']), createTestAccount);
router.patch('/:id/revoke', authenticate(), authorize(['admin']), revokeTestAccount);
router.delete('/:id', authenticate(), authorize(['admin']), deleteTestAccount);

router.get('/registrations', authenticate(), authorize(['admin']), listRegistrations);
router.patch('/registrations/:id/approve', authenticate(), authorize(['admin']), approveRegistration);
router.patch('/registrations/:id/reject', authenticate(), authorize(['admin']), rejectRegistration);

module.exports = router;
