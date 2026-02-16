import Message from "../models/Message.js";

export default function socketHandler(io) {
  const onlineUsers = new Map();

  io.on("connection", async (socket) => {
    console.log("✅ Connected:", socket.id);

    const userId = socket.handshake.query.userId;

    // STORE ONLINE USERS
    onlineUsers.set(socket.id, userId);

    // SEND ONLINE LIST
    io.emit("online_users", Array.from(onlineUsers.values()));

    // LOAD OLD MESSAGES
    const oldMessages = await Message.find().sort({ createdAt: 1 });
    socket.emit("load_messages", oldMessages);

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      const saved = await Message.create({
        text: data.text,
        senderId: userId,
        status: "sent",
        time: new Date(),
      });

      // sender gets instant message
      socket.emit("receive_message", saved);

      // others receive
      socket.broadcast.emit("receive_message", saved);

      // mark delivered immediately
      await Message.findByIdAndUpdate(saved._id, {
        status: "delivered",
      });

      io.emit("message_status", {
        _id: saved._id,
        status: "delivered",
      });
    });

    // SEEN EVENT (THIS FIXES BLUE TICK)
    socket.on("message_seen", async (id) => {
      await Message.findByIdAndUpdate(id, {
        status: "seen",
      });

      io.emit("message_status", {
        _id: id,
        status: "seen",
      });
    });

    // DELETE MESSAGE
    socket.on("delete_message", async (id) => {
      await Message.findByIdAndDelete(id);
      io.emit("message_deleted", id);
    });

    // CLEAR CHAT
    socket.on("clear_chat", async () => {
      await Message.deleteMany({});
      io.emit("chat_cleared");
    });

    // TYPING
    socket.on("typing", () => {
      socket.broadcast.emit("typing", userId);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("online_users", Array.from(onlineUsers.values()));
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
