const express = require('express');
const audit = require('../controllers/audit.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate());
router.get('/', authorize(['admin']), audit.getAuditLogs);

module.exports = router;
