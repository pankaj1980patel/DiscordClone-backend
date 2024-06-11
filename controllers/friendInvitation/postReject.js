const FriendInvitation = require("../../models/friendInvitation")
const friendsUpdates = require("../../socketHandlers/updates/friends")
const postReject = async (req, res) => {
    try {
        const {id} = req.body;
        const {userId} = req.user;

        // remove that invitation from our database
        const invitationExists = await FriendInvitation.exists({_id:id})
        if(invitationExists){
            await FriendInvitation.findByIdAndDelete(id);
        }
        // Update pending invitaion
        friendsUpdates.updateFriendsPendingInvitations(userId);
        return res.status(200).send("Invitation Rejected")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong please try again later!")
    }
};
module.exports = postReject;
