// const http = require("http");
// const { Server } = require("socket.io");
// const app = require("./app");
// const socketHandler = require("./websockets/socketHandler");

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// socketHandler(io);

// const PORT = process.env.PORT || 3000;
// console.log(process.env.PORT);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const http = require("http");
const WebSocket = require("ws");
const app = require("./app");
const socketHandler = require("./websockets/socketHandler");

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// socketHandler(wss); // Pass WebSocket server to the handler

const { broadcastToAllClients } = socketHandler(wss);

// Export the function for use in other parts of the app
module.exports = {
  broadcastToAllClients,
};

const PORT = process.env.PORT || 3000;
console.log(process.env.PORT);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
