const express = require('express');
const submissions = require('../controllers/submissions.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../utils/validators');
const { createUploadMiddleware } = require('../services/storageService');

const router = express.Router();
const synopsisUpload = createUploadMiddleware({ subdir: 'synopsis' });
const thesisUpload = createUploadMiddleware({ subdir: 'thesis' });

router.use(authenticate());
router.post('/synopsis', authorize(['scholar']), synopsisUpload.single('file'), validate(schemas.createSubmission), submissions.submitSynopsis);
router.put('/synopsis/:id/status', authorize(['supervisor', 'drc']), validate(schemas.idParam, 'params'), validate(schemas.updateSubmissionStatus), submissions.updateSynopsisStatus);
// TODO: VERIFY_INFERENCE Route is present in route-map.json but absent from api-spec.json.
router.post('/thesis', authorize(['scholar']), thesisUpload.single('file'), validate(schemas.createSubmission), submissions.submitThesis);

module.exports = router;
