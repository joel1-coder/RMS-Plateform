const Minute = require('../models/Minute.model');
const { asyncHandler } = require('../middlewares/errorHandler');

function formatMinute(minute) {
  const doc = minute.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

const createMinute = asyncHandler(async (req, res) => {
  const minute = await Minute.create(req.body);
  res.status(201).json(formatMinute(minute));
});

const listMinutes = asyncHandler(async (req, res) => {
  const minutes = await Minute.find({}).sort({ meetingDate: -1 });
  res.json(minutes.map(formatMinute));
});

module.exports = { createMinute, listMinutes };
