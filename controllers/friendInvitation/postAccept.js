const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const User = require("../../models/user");
const postAccept = async (req, res) => {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      res.status(401).send("Error occured, Please try again later!");
    }
    const { senderId, receiverId } = invitation;
    // console.log("invitation ======", invitation);
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).send("Sender or receiver not found.");
    }
    // add friends to both user
    sender.friends = [...sender.friends, receiverId];
    receiver.friends = [...receiver.friends, senderId];

    await sender.save();
    await receiver.save();
    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    //update list of friends if the user is online
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());
    // update the list friends pending request
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());
    return res.status(200).send("Friend Successfully Added!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong please try again later!");
  }
};

module.exports = postAccept;
