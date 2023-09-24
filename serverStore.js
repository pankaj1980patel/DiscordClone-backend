const connectedUser = new Map();

const addNewConnectedUser = ({ socketId, userId }) => {
  console.log(userId);
  connectedUser.set(socketId, { userId });
  console.log("new user ", connectedUser);
};
const removeConnectedUser = (socket) => {
  connectedUser.delete(socket.id);
  console.log("disconnected user ", connectedUser);
};
const getActiveConnection = (userId) => {
  const activeConnection = [];
  connectedUser.forEach((key, value) => {
    if (value.userId === userId) {
      activeConnection.push(key);
    }
  });
  return activeConnection;
};
module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnection,
};
