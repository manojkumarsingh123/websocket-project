module.exports = (sequelize, DataTypes) => {
  const ReadReceipt = sequelize.define("ReadReceipt", {
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return ReadReceipt;
};
