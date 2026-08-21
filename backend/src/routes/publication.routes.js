const express = require('express');
const publications = require('../controllers/publication.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { createUploadMiddleware } = require('../services/storageService');

const router = express.Router();
const pubUpload = createUploadMiddleware({ subdir: 'publication' });

router.use(authenticate());

router.get('/', publications.listPublications);
router.post('/', authorize(['scholar', 'admin']), pubUpload.single('file'), publications.createPublication);
router.put('/:id', authorize(['admin', 'supervisor', 'scholar']), publications.updatePublication);
router.delete('/:id', authorize(['admin', 'scholar']), publications.deletePublication);

module.exports = router;
