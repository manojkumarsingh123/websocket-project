module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define("ChatRoom", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  ChatRoom.associate = (models) => {
    ChatRoom.belongsTo(models.Organization, { foreignKey: "organization_id" });
    ChatRoom.belongsTo(models.User, { foreignKey: "created_by" });
  };

  return ChatRoom;
};
