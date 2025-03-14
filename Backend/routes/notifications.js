const express = require('express');
const { createNotification, getNotifications, markNotificationAsRead, getUnreadNotificationsCount } = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

const router = express.Router();


router.post('/', auth, createNotification);
router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markNotificationAsRead);
router.get("/unread-count", auth, getUnreadNotificationsCount);

module.exports = router;
