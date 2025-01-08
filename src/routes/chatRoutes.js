const express = require("express");
const {
  getChatRooms,
  createChatRoom,
  deleteChatRoom,
  removeUser,
} = require("../controllers/chatController");
const authenticateJWT = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Define the rate limiter
const getChatRoomsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 10, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 10 minutes.",
});

// Get all chat rooms for the authenticated user's organization
router.get("/", authenticateJWT, getChatRoomsLimiter, getChatRooms);

// Create a new chat room
router.post(
  "/",
  authenticateJWT,
  authorizeRole("create_chat_room"),
  createChatRoom
);

// Create a delete chat room
router.delete(
  "/:roomId",
  authenticateJWT,
  authorizeRole("delete_chat_room"),
  deleteChatRoom
);

// Create a delete user
router.delete(
  "/user/:userId",
  authenticateJWT,
  authorizeRole("remove_user"),
  removeUser
);

module.exports = router;
