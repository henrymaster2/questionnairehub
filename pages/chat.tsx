// pages/chat.tsx
import { useEffect, useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

type RawMessageFromServer = {
  id: number;
  senderId: number | null;
  receiverId: number | null;
  content: string | null;
  senderType: "USER" | "ADMIN";
  type?: "text" | "image" | "file";
  createdAt: string;
};

type Message = {
  id: number;
  senderId: number | null;
  receiverId: number | null;
  content: string;
  senderType: "USER" | "ADMIN";
  type: "text" | "image" | "file";
  createdAt: string;
  timestamp: string;
};

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const parseDateSafe = (s: string) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const guessType = (content: string): Message["type"] => {
    if (!content) return "text";
    const lower = content.toLowerCase();
    if (lower.match(/\.(png|jpe?g|gif|webp|svg|bmp)$/)) return "image";
    if (content.startsWith("http")) return "file";
    return "text";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) return;
      const data: RawMessageFromServer[] = await res.json();
      const normalized = data
        .map((m) => {
          const created = parseDateSafe(m.createdAt);
          return {
            id: m.id,
            senderId: m.senderId,
            receiverId: m.receiverId,
            content: m.content ?? "",
            senderType: m.senderType,
            type: m.type ?? guessType(m.content ?? ""),
            createdAt: m.createdAt,
            timestamp: created.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        })
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      setMessages(normalized);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!newMsg.trim() && !file) return;
    if (!session?.user?.id) {
      alert("You must be signed in to send messages.");
      return;
    }

    try {
      let content = "";
      let type: Message["type"] = "text";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error(await uploadRes.text());
        const uploaded = await uploadRes.json();
        content = uploaded.url;
        type = uploaded.type;
      } else {
        content = newMsg.trim();
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          senderType: "USER",
          receiverId: null,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setNewMsg("");
      setFile(null);
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Sign in to start chatting
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">Chat with Admin</div>

      <div className="chat-messages">
        {messages.map((m) => {
          const isUser = m.senderType === "USER";
          return (
            <div key={m.id} className={`message-row ${isUser ? "user" : "admin"}`}>
              <div className="message-bubble">
                <div className="sender-label">{isUser ? "You" : "Admin"}</div>
                {m.type === "image" ? (
                  <img src={m.content} alt="uploaded" className="message-image" />
                ) : m.type === "file" ? (
                  <a href={m.content} target="_blank" className="file-link" rel="noreferrer">
                    📎 Download File
                  </a>
                ) : (
                  <div className="message-text">{m.content}</div>
                )}
                <div className="message-time">{m.timestamp}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="file-label">
          📎
        </label>
        <button onClick={sendMessage}>➤</button>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #ece5dd;
        }
        .chat-header {
          padding: 15px;
          background-color: #075e54;
          color: #fff;
          font-weight: bold;
          font-size: 18px;
          flex-shrink: 0;
        }
        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
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
          padding: 10px 14px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          background: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .message-row.user .message-bubble {
          background-color: #dcf8c6;
        }
        .sender-label {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #444;
        }
        .message-text {
          font-size: 16px;
          color: #000;
        }
        .message-time {
          font-size: 11px;
          color: #555;
          align-self: flex-end;
          margin-top: 4px;
        }
        .message-image {
          max-width: 220px;
          border-radius: 8px;
          margin-bottom: 6px;
        }
        .file-link {
          color: #075e54;
          text-decoration: underline;
        }
        .chat-input {
          flex-shrink: 0;
          display: flex;
          padding: 10px;
          background-color: #f0f0f0;
          align-items: center;
          padding-bottom: env(safe-area-inset-bottom);
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
      `}</style>
    </div>
  );
}
