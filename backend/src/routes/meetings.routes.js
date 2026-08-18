const express = require('express');
const meetings = require('../controllers/meetings.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../utils/validators');

const router = express.Router();

router.use(authenticate());
router.get('/', authorize(['admin', 'supervisor', 'drc', 'hod']), meetings.listMeetings);
router.post('/', authorize(['admin', 'supervisor', 'drc']), validate(schemas.createMeeting), meetings.createMeeting);
router.put('/:id', authorize(['admin', 'supervisor', 'drc']), validate(schemas.idParam, 'params'), validate(schemas.updateMeeting), meetings.updateMeeting);
router.delete('/:id', authorize(['admin', 'supervisor', 'drc']), validate(schemas.idParam, 'params'), meetings.deleteMeeting);

module.exports = router;
