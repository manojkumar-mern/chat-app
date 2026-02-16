import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import MessageBubble from "../components/chat/MessageBubble";
import styles from "./Chat.module.css";

export default function Chat() {
  const { socket, myId } = useSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket || !myId) return;

    const loadHandler = (data) => {
      setMessages(data || []);

      data.forEach((msg) => {
        if (String(msg.senderId) !== String(myId) && msg.status !== "seen") {
          socket.emit("message_seen", msg._id);
        }
      });
    };

    const receiveHandler = (data) => {
      setMessages((prev) => {
        // remove temp message if same text & mine
        const filtered = prev.filter(
          (m) =>
            !(
              String(m._id).startsWith("temp_") &&
              String(m.senderId) === String(data.senderId) &&
              m.text === data.text
            ),
        );

        return [...filtered, data];
      });

      // mark seen
      if (String(data.senderId) !== String(myId)) {
        socket.emit("message_seen", data._id);
      }
    };

    // STATUS UPDATE (ticks update realtime)
    const statusHandler = (updated) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === updated._id ? { ...m, status: updated.status } : m,
        ),
      );
    };

    // DELETE MESSAGE
    const deleteHandler = (id) => {
      setMessages((prev) => prev.filter((m) => m._id !== id));
    };

    // CLEAR CHAT
    const clearHandler = () => {
      setMessages([]);
    };

    // TYPING
    const typingHandler = (id) => {
      if (id !== myId) {
        setTypingUser(true);
        setTimeout(() => setTypingUser(false), 1500);
      }
    };

    socket.on("load_messages", loadHandler);
    socket.on("receive_message", receiveHandler);
    socket.on("message_status", statusHandler);
    socket.on("message_deleted", deleteHandler);
    socket.on("chat_cleared", clearHandler);
    socket.on("typing", typingHandler);

    return () => {
      socket.off("load_messages", loadHandler);
      socket.off("receive_message", receiveHandler);
      socket.off("message_status", statusHandler);
      socket.off("message_deleted", deleteHandler);
      socket.off("chat_cleared", clearHandler);
      socket.off("typing", typingHandler);
    };
  }, [socket, myId]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!socket || !message.trim()) return;

    const tempId = "temp_" + Date.now();

    const msgData = {
      _id: tempId,
      text: message,
      senderId: myId,
      time: new Date(),
      status: "sent",
    };

    // instant UI render
    setMessages((prev) => [...prev, msgData]);

    socket.emit("send_message", msgData);
    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket?.emit("typing", myId);
  };

  const deleteMessage = (id) => {
    socket.emit("delete_message", id);
  };

  const clearChats = () => {
    socket.emit("clear_chat");
  };

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>💬 ChatApp</div>

        <div className={styles.conversations}>
          <div className={styles.convItem}>💬 General Chat </div>
          <div className={styles.convItem}>👨‍💻 Community </div>
          <div className={styles.convItem}>🔥 Status </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={styles.chatBox}>
        <div className={styles.header}>Chat Room</div>

        <div className={styles.messages}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              id={msg._id}
              text={msg.text}
              time={msg.time}
              status={msg.status}
              isMine={String(msg.senderId) === String(myId)}
              onDelete={deleteMessage}
            />
          ))}

          {typingUser && <div className={styles.typing}>Typing...</div>}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className={styles.inputArea}>
          <input
            value={message}
            onChange={handleTyping}
            placeholder="Type message..."
            className={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className={styles.sendBtn}>
            Send
          </button>
          <button onClick={clearChats}>Clear Chat</button>
        </div>
      </div>
    </div>
  );
} 
