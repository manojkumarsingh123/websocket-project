const { ChatRoom } = require("../models");
const { broadcastToAllClients } = require("../server");

exports.getChatRooms = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const limit = parseInt(pageSize, 10); // Number of records per page
    const offset = (parseInt(page, 10) - 1) * limit; // Offset for pagination

    const { rows: chatRooms, count } = await ChatRoom.findAndCountAll({
      where: { organization_id: req.user.organization_id },
      limit,
      offset,
      order: [["createdAt", "DESC"]], // Sort by latest created
    });

    res.status(200).json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      data: chatRooms,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chat rooms", error: error.message });
  }
};

exports.createChatRoom = async (req, res) => {
  const { name } = req.body;
  // console.log("requestd data", req);

  try {
    const chatRoom = await ChatRoom.create({
      name,
      organization_id: req.user.organization_id,
      created_by: req.user.id,
    });

    // Emit the newChatRoom event to all WebSocket clients
    // console.log("ok", broadcastToAllClients);
    // broadcastToAllClients({
    //   type: "newChatRoom",
    //   message: {
    //     roomId: chatRoom.id,
    //     roomName: chatRoom.name,
    //     organizationId: chatRoom.organization_id,
    //     notification: `A new chat room '${chatRoom.name}' has been created.`,
    //   },
    // });

    res
      .status(201)
      .json({ message: "Chat room created successfully", chatRoom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating chat room", error: error.message });
  }
};

exports.deleteChatRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findOne({
      where: { id: roomId, organization_id: req.user.organization_id },
    });

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    await chatRoom.destroy();
    res.json({ message: "Chat room deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting chat room", error: error.message });
  }
};

exports.removeUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({
      where: { id: userId, organization_id: req.user.organization_id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing user", error: error.message });
  }
};
