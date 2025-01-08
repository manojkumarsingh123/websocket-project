const express = require("express");
const {
  sendMessage,
  fetchMessageHistory,
  uploadFile,
} = require("../controllers/messageController");
const authenticateJWT = require("../middlewares/authMiddleware");
const {
  getReadReceipts,
  getReactions,
  deleteMessage,
} = require("../controllers/messageController");
const authorizeRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// Moderator action
router.delete(
  "/:messageId",
  authenticateJWT,
  authorizeRole("delete_message"),
  deleteMessage
);

// Send a message
router.post("/", authenticateJWT, sendMessage);

// Fetch message history
router.get("/:roomId", authenticateJWT, fetchMessageHistory);

// Upload a file
router.post("/upload", authenticateJWT, uploadFile);

// Fetch read receipts
router.get("/:messageId/read-receipts", authenticateJWT, getReadReceipts);

// Fetch reactions
router.get("/:messageId/reactions", authenticateJWT, getReactions);

module.exports = router;
