const onlineUsers = new Map();

const setOnline = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

const setOffline = (userId) => {
  onlineUsers.delete(userId);
};

const getOnlineUsers = () => Array.from(onlineUsers.keys());

module.exports = { setOnline, setOffline, getOnlineUsers };
