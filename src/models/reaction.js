module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define("Reaction", {
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reaction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Reaction;
};
