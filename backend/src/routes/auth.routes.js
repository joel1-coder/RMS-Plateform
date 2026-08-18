const express = require('express');
const { login } = require('../controllers/auth.controller');
const { validate, schemas } = require('../utils/validators');

const router = express.Router();

router.post('/login', validate(schemas.login), login);

module.exports = router;
