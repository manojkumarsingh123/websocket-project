const { Message, File } = require("../models");
const { ReadReceipt, Reaction } = require("../models");
const {
  encryptMessage,
  decryptMessage,
} = require("../services/encryptionService");
const { saveFile } = require("../services/fileService");

// Send a message
exports.sendMessage = async (req, res) => {
  const { content, roomId } = req.body;

  try {
    if (!content || !roomId) {
      return res
        .status(400)
        .json({ message: "Content and Room ID are required" });
    }

    // Encrypt the message content
    const encryptedContent = encryptMessage(content);

    // Save the encrypted message
    const message = await Message.create({
      chat_room_id: roomId,
      user_id: req.user.id,
      content: encryptedContent,
    });

    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Fetch message history with pagination
exports.fetchMessageHistory = async (req, res) => {
  const { roomId } = req.params;
  const { page = 1, pageSize = 50 } = req.query;

  try {
    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { rows: messages, count } = await Message.findAndCountAll({
      where: { chat_room_id: roomId },
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    // Decrypt messages
    const decryptedMessages = messages.map((msg) => ({
      ...msg.toJSON(),
      content: decryptMessage(msg.content),
    }));

    res.status(200).json({
      total: count,
      pages: Math.ceil(count / limit),
      data: decryptedMessages,
    });
  } catch (error) {
    console.error("Error fetching message history:", error.message);
    res.status(500).json({
      message: "Error fetching message history",
      error: error.message,
    });
  }
};

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file;

    if (file.size > 5 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "File size exceeds the limit of 5MB" });
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only JPEG, PNG, and PDF are allowed",
      });
    }

    // Save the file to the storage
    const fileData = await saveFile(file);

    // Save file metadata in the database
    const fileRecord = await File.create({
      chat_room_id: req.body.roomId,
      user_id: req.user.id,
      file_name: fileData.fileName,
      mime_type: fileData.mimeType,
      size: fileData.size,
      path: fileData.filePath,
    });

    res
      .status(201)
      .json({ message: "File uploaded successfully", data: fileRecord });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

// Fetch read receipts for a message
exports.getReadReceipts = async (req, res) => {
  const { messageId } = req.params;

  try {
    const receipts = await ReadReceipt.findAll({
      where: { message_id: messageId },
    });
    res.status(200).json(receipts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching read receipts", error: error.message });
  }
};

// Fetch reactions for a message
exports.getReactions = async (req, res) => {
  const { messageId } = req.params;

  try {
    const reactions = await Reaction.findAll({
      where: { message_id: messageId },
    });
    res.status(200).json(reactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reactions", error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findOne({
      where: { id: messageId },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.destroy();
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting message", error: error.message });
  }
};
