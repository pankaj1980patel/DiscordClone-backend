const serverStore = require("../serverStore")
const newConnectionHandler = async (socket, io) => {
  const userId = socket.user.userId;
//   console.log(userId)
  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId,
  });
};

module.exports = newConnectionHandler;