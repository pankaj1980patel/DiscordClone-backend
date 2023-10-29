const authSocket = require("./middlewares/authSocket");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler");
const serverStore = require("./serverStore");
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");
const roomLeaveHandler = require("./socketHandlers/roomLeaveHandler");
const roomInitializeConnectionHandler = require("./socketHandlers/roomInitializeConnectionHandler");
const roomSignalingDataHandler = require("./socketHandlers/roomSignalingDataHandler");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  serverStore.setSocketServerInstance(io);
  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUser = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("A user connected");
    console.log(socket.id);
    newConnectionHandler(socket, io);
    emitOnlineUser();

    // Handle messages sent by the

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
      io.emit("message", data);
    });

    socket.on("direct-chat-history", (data) => {
      // console.log("direct-chat-history got the data == ", data);
      directChatHistoryHandler(socket, data);
    });
    socket.on("room-create", () => {
      console.log("i am getting the log");
      roomCreateHandler(socket);
    });
    socket.on("room-join", (data) => {
      roomJoinHandler(socket, data);
    });
    socket.on("room-leave", (data) => {
      // console.log("from room-leave == ", data);
      roomLeaveHandler(socket, data);
    });
    socket.on("conn-init", (data) => {
      roomInitializeConnectionHandler(socket, data);
    });
    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
    });
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
      disconnectHandler(socket);
    });
    setInterval(() => {
      emitOnlineUser();
    }, [8000]);
  });
};

module.exports = {
  registerSocketServer,
};
