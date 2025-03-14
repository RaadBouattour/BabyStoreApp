const Notification = require('../models/Notification');


exports.createNotification = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const notification = new Notification({ userId, title, message });
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getUnreadNotificationsCount = async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        userId: req.user.id,
        isRead: false, 
      });
  
      res.status(200).json({ count });
    } catch (err) {
      console.error("Error fetching unread notifications count:", err.message);
      res.status(500).json({ error: err.message });
    }
  };


exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
