const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/authController");

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Token Refresh
router.post("/refresh-token", refreshToken);

module.exports = router;
