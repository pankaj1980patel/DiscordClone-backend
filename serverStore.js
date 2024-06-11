const { v4: uuidv4 } = require("uuid");
const connectedUser = new Map();
let activeRooms = [];
let io;
const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};
const getSocketServerInstance = () => {
  return io;
};
const addNewConnectedUser = ({ socketId, userId }) => {
  // console.log(userId);
  connectedUser.set(socketId, { userId });
  // console.log("new user ", connectedUser);
};
const removeConnectedUser = (socket) => {
  connectedUser.delete(socket.id);
  // console.log("disconnected user ", connectedUser);
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

// rooms

const addNewActiveRoom = (userId, socketId) => {
  const newActiveRoom = {
    roomCreator: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socketId,
      },
    ],
    roomId: uuidv4(),
  };
  // activeRooms.push(newActiveRoom);
  activeRooms = [...activeRooms, newActiveRoom];
  console.log("New active rooms == ", activeRooms);

  return newActiveRoom;
};

const getActiveRooms = () => {
  return [...activeRooms];
};

const getActiveRoom = (roomId) => {
  const activeRoom = activeRooms.find(
    (activeRoom) => activeRoom.roomId === roomId
  );
  if (activeRoom) {
    return { ...activeRoom };
  }
  return null;
};

const joinActiveRoom = (roomId, newParticipant) => {
  const room = activeRooms.find((room) => room.roomId === roomId);
  activeRooms = activeRooms.filter((room) => room.roomId !== roomId);

  const updatedRoom = {
    ...room,
    participants: [...room.participants, newParticipant],
  };
  activeRooms.push(updatedRoom);
  // console.log("active roomms", activeRooms);
};

const leaveActiveRoom = (roomId, socketId) => {
  console.log("from leave room active room s === ", activeRooms);
  const activeRoom = activeRooms.find((room) => room.roomId === roomId);
  console.log("we got our room == ", activeRoom);
  console.log("participantsSocketId == ", socketId);
  if (activeRoom) {
    let copyOfActiveRoom = { ...activeRoom };
    copyOfActiveRoom.participants = copyOfActiveRoom.participants.filter(
      (participant) => participant.socketId !== socketId
    );
    activeRooms = activeRooms.filter((room) => room.roomId !== roomId);
    console.log(
      "Number of participants == ",
      copyOfActiveRoom.participants.length
    );
    if (copyOfActiveRoom.participants.length > 0) {
      activeRooms.push(copyOfActiveRoom);
    }
  }
};
module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  setSocketServerInstance,
  getSocketServerInstance,
  getOnlineUsers,
  addNewActiveRoom,
  getActiveRooms,
  getActiveRoom,
  joinActiveRoom,
  leaveActiveRoom,
};
