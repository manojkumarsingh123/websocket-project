const express = require("express");
const {
  getNotificationHistory,
} = require("../controllers/notificationController");
const authenticateJWT = require("../middlewares/authMiddleware");

const router = express.Router();

// Fetch notification history
router.get("/", authenticateJWT, getNotificationHistory);

module.exports = router;
