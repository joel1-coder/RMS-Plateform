const express = require('express');
const vivas = require('../controllers/vivaVoce.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate());

router.get('/', vivas.listVivas);
router.post('/', authorize(['admin']), vivas.createViva);
router.put('/:id', authorize(['admin', 'supervisor']), vivas.updateViva);
router.delete('/:id', authorize(['admin']), vivas.deleteViva);

module.exports = router;
