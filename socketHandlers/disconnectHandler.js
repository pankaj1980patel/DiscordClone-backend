const serverStore = require("../serverStore");
const roomLeaveHandler = require("./roomLeaveHandler");
const disconnectHandler = (socket) => {
  const activeRooms = serverStore.getActiveRooms();
  activeRooms.forEach((activeRoom) => {
    const userInRoom = activeRoom.participants.some(
      (participant) => participant.userId === socket.user.userId
    );
    if (userInRoom) {
      roomLeaveHandler(socket, { roomId: activeRoom.roomId });
    }
  });

  serverStore.removeConnectedUser(socket);
};
module.exports = disconnectHandler;
