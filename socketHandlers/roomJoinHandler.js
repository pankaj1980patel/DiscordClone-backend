const serverStore = require("../serverStore");
const roomsUpdate = require("./updates/rooms");

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;
  const participantsDetails = {
    userId: socket.user.userId,
    socketId: socket.id,
  };
  const roomDetails = serverStore.getActiveRoom(roomId);
  serverStore.joinActiveRoom(roomId, participantsDetails);

  // send information to users in room that they should prepare for incoming connection
  roomDetails.participants.forEach((participant) => {
    if (participant.socketId !== participantsDetails.socketId) {
      socket.to(participant.socketId).emit("conn-prepare", {
        connUserSocketId: participantsDetails.socketId,
      });
    }
  });
  roomsUpdate.updateRooms();
};

module.exports = roomJoinHandler;
