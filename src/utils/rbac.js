const roles = {
  admin: {
    can: ["create_chat_room", "delete_chat_room", "remove_user"],
  },
  moderator: {
    can: ["delete_message"],
  },
  user: {
    can: ["send_message", "view_messages"],
  },
};

const hasPermission = (role, action) => {
  return roles[role]?.can.includes(action);
};

module.exports = { hasPermission };
