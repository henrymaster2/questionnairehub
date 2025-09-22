// pages/chat.tsx
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

type Message = {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  type: "text" | "image" | "file";
  createdAt?: string;
  timestamp?: string;
};

export default function ChatPage() {
  // Replace with actual logged-in user id (from session/auth)
  const userId = 2; // Example: logged-in user
  const adminId = 1; // Admin is always id=1 (as set in Prisma)

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/messages?userId=${userId}&adminId=${adminId}`
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
    };
    fetchMessages();
  }, []);

  // Socket setup
  useEffect(() => {
    socketRef.current = io();

    socketRef.current.emit("join", { userId });

    socketRef.current.on("message", (msg: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          timestamp: new Date(msg.createdAt || Date.now()).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          ),
        },
      ]);
      scrollToBottom();
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // Send message
  const sendMessage = async () => {
    if ((!newMsg.trim() && !file) || !socketRef.current) return;

    let msgData: Partial<Message> = {
      senderId: userId,
      receiverId: adminId,
    };

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url, type } = await uploadRes.json();

      msgData = {
        ...msgData,
        content: url,
        type,
      };

      setFile(null);
    } else {
      msgData = {
        ...msgData,
        content: newMsg,
        type: "text",
      };
    }

    // Save to DB
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    });
    const savedMsg = await res.json();

    const finalMsg: Message = {
      ...savedMsg,
      timestamp: new Date(savedMsg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Emit via socket
    socketRef.current.emit("sendMessage", {
      senderId: userId,
      content: finalMsg.content,
    });

    // Update UI
    setMessages((prev) => [...prev, finalMsg]);
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
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">Chat with Admin</div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((m, i) => {
          const isUser = m.senderId === userId;
          return (
            <div key={i} className={`message-row ${isUser ? "user" : "admin"}`}>
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

      {/* Input */}
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

      {/* Styles (unchanged) */}
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
          background-color: #ece5dd;
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
          padding-bottom: 100px;
        }
        .message-row {
          display: flex;
          margin-bottom: 10px;
        }
        .message-row.user {
          justify-content: flex-end;
        }
        .message-row.admin {
          justify-content: flex-start;
        }
        .message-bubble {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          line-height: 1.4;
        }
        .message-row.user .message-bubble {
          background-color: #dcf8c6;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .message-row.admin .message-bubble {
          background-color: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }
        .message-text {
          font-size: 16px;
          word-wrap: break-word;
          color: #000;
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
          left: 0;
          width: 100%;
          display: flex;
          padding: 10px;
          background-color: #f0f0f0;
          box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
          align-items: center;
        }
        .chat-input input[type="text"] {
          flex: 1;
          padding: 12px 15px;
          border-radius: 25px;
          border: 1px solid #ccc;
          font-size: 16px;
          color: #000;
          background-color: #fff;
        }
        .chat-input input[type="text"]::placeholder {
          color: #888;
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
      `}</style>
    </div>
  );
}
