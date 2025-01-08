const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Organization = require("./organization")(sequelize, Sequelize.DataTypes);
const User = require("./user")(sequelize, Sequelize.DataTypes);
const ChatRoom = require("./chatRoom")(sequelize, Sequelize.DataTypes);
const Messages = require("./message")(sequelize, Sequelize.DataTypes);

// Define relationships
Organization.hasMany(User, { foreignKey: "organization_id" });
User.belongsTo(Organization, { foreignKey: "organization_id" });

Organization.hasMany(ChatRoom, { foreignKey: "organization_id" });
ChatRoom.belongsTo(Organization, { foreignKey: "organization_id" });

ChatRoom.hasMany(Messages, { foreignKey: "chat_room_id" });
Messages.belongsTo(ChatRoom, { foreignKey: "chat_room_id" });

User.hasMany(Messages, { foreignKey: "user_id" });
Messages.belongsTo(User, { foreignKey: "user_id" });

module.exports = { sequelize, Organization, User, ChatRoom, Messages };
