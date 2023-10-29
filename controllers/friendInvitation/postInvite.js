const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");
const postInvite = async (req, res) => {
  const { mail } = req.body;

  const { userId } = req.user;
  const sourceMail = req.user.mail;
  if (mail.toLowerCase() === sourceMail.toLowerCase()) {
    return res.status(409).send("Intne Single ho");
  }
  const targetUser = await User.findOne({ mail: mail.toLowerCase() });
  if (!targetUser) {
    return res
      .status(404)
      .send(`Friend of ${mail} has not registerd. Please check mail.`);
  }

  //check if invitation is already sent
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });
  if (invitationAlreadyReceived) {
    return res.status(409).send("Invitation is already sent");
  }
  //check the user is already our friend or not
  const userAlreadyFriend = targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );
  if (userAlreadyFriend) {
    res
      .status(409)
      .send("Friend already added. Please check your friends list");
  }
  // create new invitation
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });
  //if invitation sent succesfully we would like to update the friend list
  // console.log("from targer user id = ", targetUser._id)
  //send pending invitation update to specific user
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  return res.send("contoller is working");
};

module.exports = postInvite;
