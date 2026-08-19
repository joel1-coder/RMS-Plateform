const express = require('express');
const notifications = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate());
router.get('/', notifications.getNotifications);
router.put('/read', notifications.markAsRead);
router.delete('/clear', notifications.clearNotifications);

module.exports = router;
