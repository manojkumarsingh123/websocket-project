const { getUserNotifications } = require("../services/notificationService");

// Fetch notification history for a user
exports.getNotificationHistory = async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user.id);
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: error.message });
  }
};
