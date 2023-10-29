const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const serverStore = require("../../serverStore");
const updateFriendsPendingInvitations = async (userId) => {
  // console.log("user id form update friends", userId);
  try {
    const pendingInvitation = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id username mail");
    // console.log(pendingInvitation);
    //find all active connection of specific userId
    const receiverList = serverStore.getActiveConnections(userId);
    const io = serverStore.getSocketServerInstance();
    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-invitations", {
        pendingInvitation,
      });
    });
  } catch (error) {
    console.log("error happen at updateFriendsPendingInvitations : ", error);
  }
};

const updateFriends = async (userId) => {
  try {
    const receiverList = serverStore.getActiveConnections(userId);
    if (receiverList.length > 0) {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id mail username"
      );
      if (user) {
        const friendsList = user.friends.map((f) => {
          return {
            id: f._id,
            mail: f.mail,
            username: f.username,
          };
        });
        // find active connections for specific userId (online users)

        // get io server instance
        const io = serverStore.getSocketServerInstance();
        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("friends-list", {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateFriendsPendingInvitations,
  updateFriends,
};
