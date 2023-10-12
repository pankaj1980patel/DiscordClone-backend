const authSocket = require("./middlewares/authSocket");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const serverStore = require("./serverStore");

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

    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);

      // Broadcast the message to all connected clients
      io.emit("message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
      disconnectHandler(socket);
    });
    setInterval(()=>{
      emitOnlineUser();
    },[8000]);
  });
};

module.exports = {
  registerSocketServer,
};
