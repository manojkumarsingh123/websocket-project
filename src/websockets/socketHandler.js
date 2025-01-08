// const { ChatRoom, Message } = require("../models");
// const rateLimit = require("../services/rateLimiter");
// const {
//   setOnline,
//   setOffline,
//   getOnlineUsers,
// } = require("../services/presenceService");
// const { ReadReceipt, Reaction } = require("../models");
// const { hasPermission } = require("../utils/rbac");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Handle joining a chat room
//     socket.on("joinRoom", async ({ roomId, userId }) => {
//       socket.join(roomId);

//       // Notify others in the room
//       io.to(roomId).emit("notification", `User ${userId} joined the room`);

//       console.log(`User ${userId} joined room: ${roomId}`);
//     });

//     // Notify users about a new message (if not in the room)
//     socket.on("newMessage", async ({ roomId, userId, content }) => {
//       socket
//         .to(roomId)
//         .emit("notification", `New message in room ${roomId}: ${content}`);

//       // Save notification for the user
//       await createNotification(
//         userId,
//         `You have a new message in room ${roomId}`
//       );
//     });

//     // Notify users about a new chat room
//     socket.on("newChatRoom", async ({ roomId, roomName, invitedUsers }) => {
//       invitedUsers.forEach(async (userId) => {
//         io.to(userId).emit(
//           "notification",
//           `You were added to the chat room: ${roomName}`
//         );
//         await createNotification(
//           userId,
//           `You were added to the chat room: ${roomName}`
//         );
//       });
//     });

//     // Notify users about admin actions
//     socket.on("adminAction", async ({ userId, action }) => {
//       io.to(userId).emit(
//         "notification",
//         `Admin performed the following action: ${action}`
//       );
//       await createNotification(userId, `Admin action: ${action}`);
//     });

//     // Handle leaving a chat room
//     socket.on("leaveRoom", async ({ roomId, userId }) => {
//       socket.leave(roomId);

//       // Notify others in the room
//       io.to(roomId).emit("notification", `User ${userId} left the room`);

//       console.log(`User ${userId} left room: ${roomId}`);
//     });

//     // Handle sending a message
//     socket.on("sendMessage", async ({ roomId, userId, content }) => {
//       try {
//         // Save the message to the database
//         const message = await Message.create({
//           chat_room_id: roomId,
//           user_id: userId,
//           content,
//         });

//         // Broadcast the message to others in the room
//         io.to(roomId).emit("newMessage", {
//           id: message.id,
//           user_id: userId,
//           chat_room_id: roomId,
//           content: message.content,
//           created_at: message.created_at,
//         });

//         console.log(`Message sent to room ${roomId} by user ${userId}`);
//       } catch (error) {
//         console.error("Error sending message:", error.message);
//       }
//     });

//     // Handle typing indicator
//     socket.on("typing", ({ roomId, userId }) => {
//       socket.to(roomId).emit("typing", { userId });
//     });

//     // Handle stopping typing indicator
//     socket.on("stopTyping", ({ roomId, userId }) => {
//       socket.to(roomId).emit("stopTyping", { userId });
//     });

//     // Handle disconnect
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });

//     // Handle user presence
//     socket.on("setOnline", (userId) => {
//       setOnline(userId, socket.id);
//       io.emit("onlineUsers", getOnlineUsers());
//     });

//     socket.on("disconnect", () => {
//       setOffline(socket.id);
//       io.emit("onlineUsers", getOnlineUsers());
//     });

//     // Rate limiting for messages
//     socket.on("sendMessage", (data) => {
//       const { role, action } = data;

//       // Check if the user has permission to send a message
//       if (!hasPermission(role, "send_message")) {
//         return socket.emit("error", "Forbidden: Insufficient permissions");
//       }

//       // Proceed to emit the message to the room
//       io.to(data.roomId).emit("newMessage", data);
//     });

//     // Read receipt
//     socket.on("readMessage", async ({ userId, messageId }) => {
//       await ReadReceipt.create({ user_id: userId, message_id: messageId });
//       io.emit("messageRead", { userId, messageId });
//     });

//     // Message reactions
//     socket.on("reactMessage", async ({ userId, messageId, reaction }) => {
//       await Reaction.create({
//         user_id: userId,
//         message_id: messageId,
//         reaction,
//       });
//       io.emit("messageReaction", { userId, messageId, reaction });
//     });

//     socket.on("deleteMessage", (data) => {
//       const { role, action } = data;

//       if (!hasPermission(role, "delete_message")) {
//         return socket.emit("error", "Forbidden: Insufficient permissions");
//       }

//       io.to(data.roomId).emit("messageDeleted", data.messageId);
//     });
//   });
// };

const { ChatRoom, Messages } = require("../models");
// const rateLimit = require("../services/rateLimiter");
const {
  setOnline,
  setOffline,
  getOnlineUsers,
} = require("../services/presenceService");
const { ReadReceipt, Reaction } = require("../models");
const { hasPermission } = require("../utils/rbac");
const WebSocket = require("ws");

module.exports = (wss) => {
  const clients = new Map(); // Store the connected clients by their userId
  const rooms = new Map(); // Store the rooms and their connected clients

  wss.on("connection", (ws) => {
    console.log("User connected");

    // Add the WebSocket client to a Map (could use userId to manage presence)
    ws.on("message", async (message) => {
      console.log("message", JSON.parse(message));
      try {
        const data = JSON.parse(message);
        console.log("data", data.data.roomId);

        // Handle different events
        if (data.event === "joinRoom") {
          // Handle joining a room
          const roomId = data.data.roomId;
          const userId = data.data.userId;
          console.log(roomId, userId);
          console.log("data", data);

          if (!rooms.has(roomId)) {
            rooms.set(roomId, []);
          }
          rooms.get(roomId).push(ws); // Add this client to the room

          // Notify others in the room
          broadcastToRoom(roomId, {
            type: "notification",
            message: `User ${userId} joined the room`,
          });

          console.log(`User ${userId} joined room: ${roomId}`);
        }

        if (data.event === "newMessage") {
          // Handle new message in a room
          console.log("data of new Message", data.data.roomId);

          const roomId = data.data.roomId;
          const userId = data.data.userId;
          const content = data.data.content;
          const message = await Message.create({
            chat_room_id: roomId,
            user_id: userId,
            content,
          });

          broadcastToRoom(roomId, {
            type: "newMessage",
            message: {
              id: message.id,
              user_id: userId,
              content: message.content,
              created_at: message.created_at,
            },
          });

          console.log(`Message sent to room ${roomId} by user ${userId}`);
        }

        if (data.event === "sendMessage") {
          const roomId = data.data.roomId;
          const userId = data.data.userId;
          const content = data.data.content; // Extract roomId, userId, and content

          // Step 1: Save the message to the database (optional)
          // const savedMessage = await Messages.create({
          //   chat_room_id: roomId,
          //   user_id: userId,
          //   content: content,
          // });
          // broadcastToRoom(roomId, {
          //   type: "sendMessage",
          //   message: {
          //     id: savedMessage.id,
          //     user_id: userId,
          //     content: content,
          //     // created_at: savedMessage.created_at,
          //   },
          // });

          // Step 2: Broadcast the new message to all clients in the room
          broadcastToRoom(roomId, {
            type: "newMessage",
            message: {
              // id: savedMessage.id,
              user_id: userId,
              content: content,
              // created_at: savedMessage.created_at,
            },
          });

          console.log(
            `Message sent to room ${roomId} by user ${userId}: ${content}`
          );
        }

        if (data.event === "leaveRoom") {
          const roomId = data.data.roomId;
          const userId = data.data.userId;

          // Step 2: Broadcast the new message to all clients in the room
          broadcastToRoom(roomId, {
            type: "leaveRoom",
            message: {
              user_id: userId,
            },
          });

          console.log(`User ${user_id} leave the room`);
        }
        if (data.event === "typing") {
          console.log("data of typing", data);
          // Handle typing indicator
          const roomId = data.data.roomId;
          const userId = data.data.userId;
          broadcastToRoom(roomId, {
            type: "typing",
            message: {
              user_id: userId,
            },
          });
        }

        // Handle new chat room creation event
        if (data.event === "newChatRoom") {
          console.log("");
          const { roomId, roomName, organizationId } = data.data;

          // Broadcast the new chat room creation to all clients
          broadcastToAllClients({
            type: "newChatRoom",
            message: {
              roomId,
              roomName,
              organizationId,
              notification: `A new chat room '${roomName}' has been created in organization ${organizationId}.`,
            },
          });

          console.log(
            `New chat room '${roomName}' created in organization ${organizationId}`
          );
        }

        if (data.event === "stopTyping") {
          // Handle stopping typing indicator
          const { roomId, userId } = data;
          broadcastToRoom(roomId, { type: "stopTyping", userId });
        }

        if (data.event === "readMessage") {
          // Handle read receipt
          const { userId, messageId } = data;
          await ReadReceipt.create({ user_id: userId, message_id: messageId });
          broadcastToAllClients({ type: "messageRead", userId, messageId });
        }

        if (data.event === "reactMessage") {
          // Handle message reactions
          const userId = data.data.userId;
          const messageId = data.data.messageId;
          const reaction = data.data.reaction;

          // await Reaction.create({
          //   user_id: userId,
          //   message_id: messageId,
          //   reaction,
          // });

          // broadcastToAllClients({
          //   type: "reactMessage",
          //   userId,
          //   messageId,
          //   reaction,
          // });
          broadcastToAllClients({
            type: "reactMessage",
            message: {
              userId,
              messageId,
              reaction,
            },
          });
        }

        if (data.event === "adminAction") {
          // Handle admin action notifications
          const { userId, action } = data;
          sendMessageToUser(userId, {
            type: "adminAction",
            message: `Admin performed the following action: ${action}`,
          });
        }

        if (data.event === "deleteMessage") {
          // Handle message deletion
          const { role, roomId, messageId } = data;

          if (!hasPermission(role, "delete_message")) {
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "Forbidden: Insufficient permissions",
              })
            );
          }

          broadcastToRoom(roomId, { type: "messageDeleted", messageId });
        }
      } catch (error) {
        console.error("Error handling message:", error.message);
      }
    });

    ws.on("close", () => {
      console.log("User disconnected");
      // Clean up room data when a client disconnects
      rooms.forEach((clientsInRoom, roomId) => {
        const index = clientsInRoom.indexOf(ws);
        if (index !== -1) {
          clientsInRoom.splice(index, 1);
          // Notify the room that a user left
          broadcastToRoom(roomId, {
            type: "notification",
            message: "A user has disconnected",
          });
        }
      });
    });

    // Handle user presence
    ws.on("setOnline", (userId) => {
      setOnline(userId, ws);
      broadcastToAllClients({ type: "onlineUsers", users: getOnlineUsers() });
    });

    ws.on("disconnect", () => {
      setOffline(ws);
      broadcastToAllClients({ type: "onlineUsers", users: getOnlineUsers() });
    });
  });

  // Helper function to send messages to a specific user
  const sendMessageToUser = (userId, message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.userId === userId) {
        client.send(JSON.stringify(message));
      }
    });
  };

  // Helper function to broadcast a message to all clients in a room
  const broadcastToRoom = (roomId, message) => {
    if (!rooms.has(roomId)) return;
    rooms.get(roomId).forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  const broadcastToAllClients = (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  // Return the broadcastToAllClients function
  return {
    broadcastToAllClients,
  };
};
