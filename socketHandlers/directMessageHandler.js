const Message = require("../models/message");
const Conversation = require("../models/conversation");
const chatUpdates = require("../socketHandlers/updates/chat");
const directMessageHandler = async (socket, data) => {
  try {
    console.log("direct message event handling started");
    const { userId } = socket.user;

    const { receiverUserId, content } = data;
    // create new message
    const message = await Message.create({
      author: userId,
      content: content,
      date: new Date(),
      type: "DIRECT",
    });

    // find if the conversation already exits - if not create one
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      // perfrom and update to sender and receiver if is online
      chatUpdates.updateChatHistory(conversation._id.toString());
    } else {
      // create new conversation uf not exists
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });
      // perfrom and update to sender and receiver if is online
      chatUpdates.updateChatHistory(newConversation._id.toString());
    }

    const conversation2 = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });
    console.log("new Conversation === ", conversation2);
  } catch (err) {
    console.log(err);
  }
};

module.exports = directMessageHandler;
