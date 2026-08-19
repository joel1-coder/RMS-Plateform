const Meeting = require('../models/Meeting.model');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');
const { logAudit } = require('../utils/auditLogger');
const { createNotification } = require('../utils/notificationHelper');

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

  // Log Audit
  await logAudit({
    user: req.user?.name || 'System',
    action: 'Meeting Scheduled',
    detail: `Scheduled ${meeting.type} for scholar ${meeting.scholar} on ${meeting.date}`,
    severity: 'Success'
  });

  // Find scholar user to notify
  const scholarUser = await User.findOne({
    name: { $regex: new RegExp(`^${meeting.scholar}$`, 'i') },
    role: 'scholar'
  });

  if (scholarUser) {
    await createNotification({
      userId: scholarUser._id,
      title: 'New Meeting Scheduled',
      message: `A meeting of type "${meeting.type}" has been scheduled for you on ${meeting.date} at ${meeting.time} at ${meeting.venue}.`,
      type: 'meeting'
    });

    // Also notify supervisor if assigned
    if (scholarUser.assignedSupervisorId) {
      await createNotification({
        userId: scholarUser.assignedSupervisorId,
        title: 'Scholar Meeting Scheduled',
        message: `A meeting of type "${meeting.type}" has been scheduled for your scholar ${scholarUser.name} on ${meeting.date} at ${meeting.time}.`,
        type: 'meeting'
      });
    }
  }

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

  // Log Audit
  await logAudit({
    user: req.user?.name || 'System',
    action: 'Meeting Updated',
    detail: `Updated meeting details of type ${meeting.type} for scholar ${meeting.scholar}`,
    severity: 'Info'
  });

  // Find scholar user to notify
  const scholarUser = await User.findOne({
    name: { $regex: new RegExp(`^${meeting.scholar}$`, 'i') },
    role: 'scholar'
  });

  if (scholarUser) {
    await createNotification({
      userId: scholarUser._id,
      title: 'Meeting Rescheduled/Updated',
      message: `Your meeting of type "${meeting.type}" has been updated. New details: Date: ${meeting.date}, Time: ${meeting.time}, Venue: ${meeting.venue}.`,
      type: 'meeting'
    });
  }

  res.json(formatMeeting(meeting));
});

const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) {
    throw new AppError('Meeting not found', 404);
  }

  await Meeting.findByIdAndDelete(req.params.id);

  // Log Audit
  await logAudit({
    user: req.user?.name || 'System',
    action: 'Meeting Cancelled',
    detail: `Cancelled/Deleted meeting of type ${meeting.type} for scholar ${meeting.scholar}`,
    severity: 'Warning'
  });

  // Find scholar user to notify
  const scholarUser = await User.findOne({
    name: { $regex: new RegExp(`^${meeting.scholar}$`, 'i') },
    role: 'scholar'
  });

  if (scholarUser) {
    await createNotification({
      userId: scholarUser._id,
      title: 'Meeting Cancelled',
      message: `Your scheduled meeting of type "${meeting.type}" on ${meeting.date} has been cancelled.`,
      type: 'meeting'
    });
  }

  res.json({ success: true });
});

module.exports = { listMeetings, createMeeting, updateMeeting, deleteMeeting };
