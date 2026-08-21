const express = require('express');
const theses = require('../controllers/thesis.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { createUploadMiddleware } = require('../services/storageService');

const router = express.Router();
const thesisUpload = createUploadMiddleware({ subdir: 'thesis' });

router.use(authenticate());

router.get('/', theses.listTheses);
router.post('/', authorize(['scholar', 'supervisor', 'admin']), thesisUpload.single('file'), theses.createThesis);
router.put('/:id', authorize(['admin', 'supervisor']), theses.updateThesis);
router.delete('/:id', authorize(['admin']), theses.deleteThesis);

module.exports = router;
