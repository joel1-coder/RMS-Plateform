const express = require('express');
const research = require('../controllers/research.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../utils/validators');

const router = express.Router();

router.use(authenticate());
router.get('/', authorize(['admin', 'supervisor', 'scholar', 'hod', 'drc']), validate(schemas.listResearch, 'query'), research.listResearch);
router.post('/', authorize(['admin']), validate(schemas.createResearch), research.createResearch);
router.put('/:id', authorize(['admin', 'supervisor']), validate(schemas.idParam, 'params'), validate(schemas.updateResearch), research.updateResearch);
router.delete('/:id', authorize(['admin']), validate(schemas.idParam, 'params'), research.deleteResearch);

module.exports = router;
