// pages/admin-chats.tsx
import { useEffect, useState, useRef } from "react";

type Message = {
  id: number;
  senderId?: number | null;
  receiverId?: number | null;
  senderType: "USER" | "ADMIN";
  content: string;
  createdAt: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  unread?: number;
};

export default function AdminChats() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          
          setUsers(data.map((u: User) => ({ ...u, unread: u.unread || 0 })));
        }
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

 
  const selectUser = async (user: User) => {
    setSelectedUser(user);
    setSidebarOpen(false);

    
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
    );

    await loadMessages(user.id);
  };

  const loadMessages = async (userId: number) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      if (res.ok) {
        const data: Message[] = await res.json();

        
        data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages(data);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  
  useEffect(() => {
    if (!selectedUser) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?userId=${selectedUser.id}`);
        if (res.ok) {
          const data: Message[] = await res.json();

        
          data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          
          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === selectedUser.id) return u; 
              const prevCount = messages.filter(
                (m) => m.senderId === u.id && m.senderType === "USER"
              ).length;
              const newCount = data.filter(
                (m) => m.senderId === u.id && m.senderType === "USER"
              ).length;
              return { ...u, unread: Math.max(0, (u.unread || 0) + (newCount - prevCount)) };
            })
          );

          setMessages(data);
          scrollToBottom();
        }
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedUser, messages]);

 
  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;

    const msgData = {
      senderType: "ADMIN",
      receiverId: selectedUser.id,
      content: newMsg,
    };

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    });

    if (res.ok) {
      setNewMsg("");
      await loadMessages(selectedUser.id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="admin-chat-container">
    
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h3>Users</h3>
        {users.map((u) => (
          <div
            key={u.id}
            className={`user-item ${
              selectedUser?.id === u.id ? "selected" : ""
            }`}
            onClick={() => selectUser(u)}
          >
            <span className="user-name">{u.name || u.email}</span>
            {u.unread ? <span className="unread">{u.unread}</span> : null}
          </div>
        ))}
      </div>

     
      <div className="chat-panel">
        <div className="chat-header">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          {selectedUser
            ? `Chat with ${selectedUser.name || selectedUser.email}`
            : "Select a user"}
        </div>

        <div className="chat-messages">
          {messages.map((m) => {
            const isAdmin = m.senderType === "ADMIN";
            return (
              <div
                key={m.id}
                className={`message-row ${isAdmin ? "admin" : "user"}`}
              >
                <div className="message-bubble">
                  <span className="message-text">{m.content}</span>
                  <span className="message-time">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
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

            <style jsx>{`
        .admin-chat-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
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
          display: flex;
          align-items: center;
        }
        .menu-btn {
          display: none;
          margin-right: 10px;
          font-size: 20px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
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
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -250px;
            top: 0;
            bottom: 0;
            height: 100%;
            transition: left 0.3s ease;
            z-index: 10;
          }
          .sidebar.open {
            left: 0;
          }
          .menu-btn {
            display: inline-block;
          }
          .chat-input {
            left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
