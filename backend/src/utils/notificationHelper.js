const Notification = require('../models/Notification.model');

async function createNotification({ userId, title, message, type = 'general' }) {
  try {
    await Notification.create({ userId, title, message, type });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}

module.exports = { createNotification };
