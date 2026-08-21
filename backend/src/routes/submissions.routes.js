const express = require('express');
const submissions = require('../controllers/submissions.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../utils/validators');
const { createUploadMiddleware } = require('../services/storageService');

const router = express.Router();
const synopsisUpload = createUploadMiddleware({ subdir: 'synopsis' });
const thesisUpload = createUploadMiddleware({ subdir: 'thesis' });
const progressUpload = createUploadMiddleware({ subdir: 'progress' });
const docUpload = createUploadMiddleware({ subdir: 'documents' });

router.use(authenticate());

router.get('/', submissions.listSubmissions);
router.post('/synopsis', authorize(['scholar']), synopsisUpload.single('file'), validate(schemas.createSubmission), submissions.submitSynopsis);
router.post('/thesis', authorize(['scholar']), thesisUpload.single('file'), validate(schemas.createSubmission), submissions.submitThesis);
router.post('/progress', authorize(['scholar']), progressUpload.single('file'), validate(schemas.createSubmission), submissions.submitProgressReport);
router.post('/document', authorize(['scholar', 'admin']), docUpload.single('file'), validate(schemas.createSubmission), submissions.submitDocument);
router.put('/synopsis/:id/status', authorize(['supervisor', 'drc', 'admin']), validate(schemas.idParam, 'params'), validate(schemas.updateSubmissionStatus), submissions.updateSynopsisStatus);
router.delete('/:id', authorize(['scholar', 'admin']), validate(schemas.idParam, 'params'), submissions.deleteSubmission);

module.exports = router;
