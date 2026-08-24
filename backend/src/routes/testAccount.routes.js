const express = require('express');
const {
  testLogin,
  listTestAccounts,
  createTestAccount,
  revokeTestAccount,
  deleteTestAccount,
} = require('../controllers/testAccount.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// PUBLIC — test login (no JWT required)
router.post('/login', testLogin);

// ADMIN ONLY — manage test accounts
router.use(authenticate());
router.get('/', authorize(['admin']), listTestAccounts);
router.post('/', authorize(['admin']), createTestAccount);
router.patch('/:id/revoke', authorize(['admin']), revokeTestAccount);
router.delete('/:id', authorize(['admin']), deleteTestAccount);

module.exports = router;
