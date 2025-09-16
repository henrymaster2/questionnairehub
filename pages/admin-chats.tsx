// pages/admin-chats.tsx
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

type Message = {
  senderId: number;
  receiverId: number;
  content: string;
  timestamp?: string;
};

type User = {
  id: number;
  name: string;
  unread?: number;
};

export default function AdminChats() {
  const adminId = 2;

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Henry" },
    { id: 3, name: "Alice" },
    { id: 4, name: "Bob" },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.emit("join", adminId);

    socketRef.current.on("receive_message", (msg: Message) => {
      if (selectedUser && msg.senderId === selectedUser.id) {
        setMessages((prev) => [
          ...prev,
          { ...msg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
        scrollToBottom();
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === msg.senderId ? { ...u, unread: (u.unread || 0) + 1 } : u))
        );
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [selectedUser]);

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setMessages([]);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u)));
  };

  const sendMessage = () => {
    if (!newMsg.trim() || !socketRef.current || !selectedUser) return;

    const msgData: Message = {
      senderId: adminId,
      receiverId: selectedUser.id,
      content: newMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socketRef.current.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMsg("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="admin-chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Users</h3>
        {users.map((u) => (
          <div
            key={u.id}
            className={`user-item ${selectedUser?.id === u.id ? "selected" : ""}`}
            onClick={() => selectUser(u)}
          >
            <span className="user-name">{u.name}</span>
            {u.unread ? <span className="unread">{u.unread}</span> : null}
          </div>
        ))}
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="chat-header">
          {selectedUser ? `Chat with ${selectedUser.name}` : "Select a user"}
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => {
            const isAdmin = m.senderId === adminId;
            return (
              <div
                key={i}
                className={`message-row ${isAdmin ? "admin" : "user"}`}
              >
                <div className="message-bubble">
                  <span className="message-text">{m.content}</span>
                  {m.timestamp && <span className="message-time">{m.timestamp}</span>}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {selectedUser && (
          <div className="chat-input">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        )}
      </div>

      {/* CSS */}
      <style jsx>{`
        .admin-chat-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .sidebar {
          width: 250px;
          border-right: 1px solid #ccc;
          background: #fff; /* clearer background */
          padding: 15px;
        }
        .sidebar h3 {
          margin-bottom: 10px;
          color: #000; /* black header text */
        }
        .user-item {
          padding: 10px;
          margin-bottom: 5px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #000; /* black user names */
        }
        .user-item.selected {
          background-color: #dcf8c6;
        }
        .user-item:hover {
          background-color: #e0e0e0;
        }
        .unread {
          background: #075e54;
          color: #fff;
          border-radius: 50%;
          padding: 2px 7px;
          font-size: 12px;
        }
        .user-name {
          font-weight: 500;
        }

        .chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .chat-header {
          padding: 15px;
          background-color: #075e54;
          color: #fff;
          font-weight: bold;
          font-size: 18px;
        }
        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background-color: #f2f2f2; /* clearer chat background */
          padding-bottom: 100px;
        }
        .message-row {
          display: flex;
          margin-bottom: 10px;
        }
        .message-row.admin {
          justify-content: flex-end;
        }
        .message-row.user {
          justify-content: flex-start;
        }
        .message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          line-height: 1.4;
          color: #000; /* black text for all messages */
        }
        .message-row.admin .message-bubble {
          background-color: #dcf8c6;
        }
        .message-row.user .message-bubble {
          background-color: #fff;
        }
        .message-text {
          font-size: 16px;
          word-wrap: break-word;
        }
        .message-time {
          font-size: 11px;
          color: #555;
          align-self: flex-end;
          margin-top: 5px;
        }
        .chat-input {
          position: fixed;
          bottom: 0;
          left: 250px;
          width: calc(100% - 250px);
          display: flex;
          padding: 10px;
          background-color: #f0f0f0;
          box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
        }
        .chat-input input {
          flex: 1;
          padding: 12px 15px;
          border-radius: 25px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 16px;
          background-color: #fff;
          color: #000; /* black input text */
        }
        .chat-input button {
          margin-left: 10px;
          padding: 12px 18px;
          border-radius: 50%;
          background-color: #075e54;
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .sidebar { width: 200px; }
          .chat-input { left: 200px; width: calc(100% - 200px); }
        }
        @media (max-width: 600px) {
          .sidebar { display: none; }
          .chat-input { left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
