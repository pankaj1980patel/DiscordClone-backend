const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const serverStore = require("../../socketServer");

const updateFriendsPendingInvitations = async (userId) => {
  try {
    const pendingInvitation = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id username mail");
    console.log(pendingInvitation);
  } catch (error) {
    console.log("error happen at updateFriendsPendingInvitations : ", error);
  }
};
