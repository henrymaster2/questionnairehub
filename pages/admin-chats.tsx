// pages/admin-chats.tsx
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

type Message = {
  senderEmail: string;
  receiverEmail: string;
  content: string;
  type: "text" | "image" | "file";
  timestamp?: string;
};

type User = {
  email: string;
  name: string;
  unread?: number;
};

export default function AdminChats() {
  const adminEmail = "admin@example.com"; // ✅ replace with real admin session email

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  // Setup socket
  useEffect(() => {
    socketRef.current = io();

    socketRef.current.emit("join", adminEmail);

    socketRef.current.on("receive_message", (msg: Message) => {
      if (selectedUser && msg.senderEmail === selectedUser.email) {
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        scrollToBottom();
      } else {
        setUsers((prev) =>
          prev.map((u) =>
            u.email === msg.senderEmail
              ? { ...u, unread: (u.unread || 0) + 1 }
              : u
          )
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

  const selectUser = async (user: User) => {
    setSelectedUser(user);
    setUsers((prev) =>
      prev.map((u) => (u.email === user.email ? { ...u, unread: 0 } : u))
    );

    try {
      const res = await fetch(
        `/api/messages?userEmail=${encodeURIComponent(user.email)}&adminEmail=${encodeURIComponent(adminEmail)}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(
          data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
        scrollToBottom();
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const sendMessage = async () => {
    if ((!newMsg.trim() && !file) || !socketRef.current || !selectedUser) return;

    let msgData: Message;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url, type } = await uploadRes.json();

      msgData = {
        senderEmail: adminEmail,
        receiverEmail: selectedUser.email,
        content: url,
        type,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setFile(null);
    } else {
      msgData = {
        senderEmail: adminEmail,
        receiverEmail: selectedUser.email,
        content: newMsg,
        type: "text",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    // Save to DB
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    });

    socketRef.current.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMsg("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="admin-chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Users</h3>
        {users.map((u) => (
          <div
            key={u.email}
            className={`user-item ${
              selectedUser?.email === u.email ? "selected" : ""
            }`}
            onClick={() => selectUser(u)}
          >
            <span className="user-name">{u.name || u.email}</span>
            {u.unread ? <span className="unread">{u.unread}</span> : null}
          </div>
        ))}
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="chat-header">
          {selectedUser
            ? `Chat with ${selectedUser.name || selectedUser.email}`
            : "Select a user"}
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => {
            const isAdmin = m.senderEmail === adminEmail;
            return (
              <div
                key={i}
                className={`message-row ${isAdmin ? "admin" : "user"}`}
              >
                <div className="message-bubble">
                  {m.type === "text" && (
                    <span className="message-text">{m.content}</span>
                  )}
                  {m.type === "image" && (
                    <img
                      src={m.content}
                      alt="uploaded"
                      className="max-w-xs rounded-lg"
                    />
                  )}
                  {m.type === "file" && (
                    <a
                      href={m.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      📎 Download File
                    </a>
                  )}
                  {m.timestamp && (
                    <span className="message-time">{m.timestamp}</span>
                  )}
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
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="file-label">
              📎
            </label>
            <button onClick={sendMessage}>➤</button>
          </div>
        )}
      </div>

      {/* CSS (same as before) */}
      <style jsx>{`
        .admin-chat-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .sidebar {
          width: 250px;
          border-right: 1px solid #ccc;
          background: #fff;
          padding: 15px;
        }
        .sidebar h3 {
          margin-bottom: 10px;
          color: #000;
        }
        .user-item {
          padding: 10px;
          margin-bottom: 5px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #000;
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
          background-color: #f2f2f2;
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
          color: #000;
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
          align-items: center;
        }
        .chat-input input[type="text"] {
          flex: 1;
          padding: 12px 15px;
          border-radius: 25px;
          border: 1px solid #ccc;
          font-size: 16px;
          color: #000;
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
        .file-label {
          margin-left: 10px;
          cursor: pointer;
          font-size: 20px;
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

