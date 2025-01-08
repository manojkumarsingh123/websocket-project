module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define("Message", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_encrypted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chat_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // Message.associate = (models) => {
  //   Message.belongsTo(models.ChatRoom, { foreignKey: "chat_room_id" });
  //   // Message.belongsTo(models.User, { foreignKey: "user_id" });
  // };

  return Messages;
};
