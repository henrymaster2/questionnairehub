// pages/chat.tsx
import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

type Message = {
  senderId: number;
  receiverId: number;
  content: string;
  timestamp?: string;
};

export default function ChatPage() {
  const userId = 1; // logged-in user
  const adminId = 2; // admin

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket
    socketRef.current = io();

    socketRef.current.emit("join", userId);

    socketRef.current.on("receive_message", (msg: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      scrollToBottom();
    });

    // TypeScript-safe cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = () => {
    if (!newMsg.trim() || !socketRef.current) return;

    const msgData: Message = {
      senderId: userId,
      receiverId: adminId,
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
                <span className="message-text">{m.content}</span>
                {m.timestamp && <span className="message-time">{m.timestamp}</span>}
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
        <button onClick={sendMessage}>➤</button>
      </div>

      {/* CSS */}
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
          position: relative;
          display: flex;
          flex-direction: column;
          line-height: 1.4;
        }
        .message-row.user .message-bubble {
          background-color: #dcf8c6; /* WhatsApp green */
          color: #000; /* black text */
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .message-row.admin .message-bubble {
          background-color: #fff; /* white background */
          color: #222; /* dark gray text */
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
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
          left: 0;
          width: 100%;
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
        @media (max-width: 600px) {
          .message-bubble {
            max-width: 85%;
          }
          .chat-input input {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
