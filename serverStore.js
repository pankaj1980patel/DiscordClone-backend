const connectedUser = new Map();
let io;
const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};
const getSocketServerInstance = () => {
  return io;
};
const addNewConnectedUser = ({ socketId, userId }) => {
  console.log(userId);
  connectedUser.set(socketId, { userId });
  console.log("new user ", connectedUser);
};
const removeConnectedUser = (socket) => {
  connectedUser.delete(socket.id);
  console.log("disconnected user ", connectedUser);
};
const getActiveConnections = (userId) => {
  const activeConnection = [];
  connectedUser.forEach((value, key) => {
    if (value.userId === userId) {
      activeConnection.push(key);
    }
  });
  return activeConnection;
};
const getOnlineUsers = () => {
  const onlineUsers = [];
  connectedUser.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });
  return onlineUsers;
};
module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  setSocketServerInstance,
  getSocketServerInstance,
  getOnlineUsers,
};
