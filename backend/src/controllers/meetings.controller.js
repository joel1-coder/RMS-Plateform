const Meeting = require('../models/Meeting.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function formatMeeting(meeting) {
  const doc = meeting.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

const listMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find({}).sort({ date: 1, time: 1 });
  res.json(meetings.map(formatMeeting));
});

const createMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.create(req.body);
  res.status(201).json(formatMeeting(meeting));
});

const updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!meeting) {
    throw new AppError('Meeting not found', 404);
  }

  res.json(formatMeeting(meeting));
});

const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findByIdAndDelete(req.params.id);
  if (!meeting) {
    throw new AppError('Meeting not found', 404);
  }

  res.json({ success: true });
});

module.exports = { listMeetings, createMeeting, updateMeeting, deleteMeeting };
