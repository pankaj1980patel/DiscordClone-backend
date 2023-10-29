const serverStore = require("../serverStore");
const friendsUpdate = require("../socketHandlers/updates/friends");
const roomsUpdate = require("./updates/rooms");
const newConnectionHandler = async (socket, io) => {
  const userId = socket.user.userId;
  //   console.log(userId)
  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId,
  });
  //update pending friends invitaion list
  friendsUpdate.updateFriendsPendingInvitations(userId);

  // update Friends List
  friendsUpdate.updateFriends(userId);

  setTimeout(() => {
    roomsUpdate.updateRooms(socket.id);
  }, [500]);
};

module.exports = newConnectionHandler;
