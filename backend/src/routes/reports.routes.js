const express = require('express');
const reports = require('../controllers/reports.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../utils/validators');

const router = express.Router();

router.use(authenticate());
// Admin dashboard specific stats
router.get('/admin-dashboard', authorize(['admin']), reports.getAdminDashboardStats);

router.use(authorize(['admin', 'hod', 'drc']));
// TODO: VERIFY_INFERENCE Routes are present in route-map.json but absent from api-spec.json.
router.get('/scholar', validate(schemas.scholarReportQuery, 'query'), reports.scholarReport);
router.get('/generate', reports.generateReport);

module.exports = router;
