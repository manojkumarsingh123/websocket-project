module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define("File", {
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  File.associate = (models) => {
    File.belongsTo(models.ChatRoom, { foreignKey: "chat_room_id" });
    File.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return File;
};
