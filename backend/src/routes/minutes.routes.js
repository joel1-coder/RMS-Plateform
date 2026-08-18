const express = require('express');
const minutes = require('../controllers/minutes.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../utils/validators');

const router = express.Router();

router.use(authenticate());
router.get('/', authorize(['drc', 'admin']), minutes.listMinutes);
router.post('/', authorize(['drc']), validate(schemas.createMinute), minutes.createMinute);

module.exports = router;
