const express = require("express");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const fileUpload = require("express-fileupload");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { sequelize } = require("./models");

const app = express();
app.use(express.json());
app.use(fileUpload());

// Message routes
app.use("/api/messages", messageRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Chat room routes
app.use("/api/chat", chatRoutes);

// Notification routes
app.use("/api/notifications", notificationRoutes);

// Sync database
// sequelize.sync({ alter: true }).then(() => {
//   console.log("Database synchronized");
// });

module.exports = app;
