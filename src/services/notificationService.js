const { Notification } = require("../models");

// Create a new notification
const createNotification = async (userId, message) => {
  try {
    return await Notification.create({ user_id: userId, message });
  } catch (error) {
    console.error("Error creating notification:", error.message);
    throw new Error("Notification creation failed");
  }
};

// Fetch notification history for a user
const getUserNotifications = async (userId) => {
  try {
    return await Notification.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    throw new Error("Failed to fetch notifications");
  }
};

module.exports = { createNotification, getUserNotifications };
