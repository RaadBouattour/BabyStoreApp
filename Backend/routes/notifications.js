const express = require('express');
const { createNotification, getNotifications, markNotificationAsRead, getUnreadNotificationsCount } = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Create a notification (Admin only)
router.post('/', auth, createNotification);

// Get all notifications for the logged-in user
router.get('/', auth, getNotifications);

// Mark a notification as read
router.put('/:id/read', auth, markNotificationAsRead);

// Route to get the count of unread notifications
router.get("/unread-count", auth, getUnreadNotificationsCount);

module.exports = router;
