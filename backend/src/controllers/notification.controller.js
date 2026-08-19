const Notification = require('../models/Notification.model');
const { asyncHandler } = require('../middlewares/errorHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
});

const markAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user.id }, { read: true });
  res.json({ success: true });
});

const clearNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user.id });
  res.json({ success: true });
});

module.exports = { getNotifications, markAsRead, clearNotifications };
