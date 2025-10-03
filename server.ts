// server.ts
import http from "http";
import { parse } from "url";
import next from "next";
import { Server as IOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  const io = new IOServer(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join room for a user (optional)
    socket.on("join", (roomId: string | number) => {
      socket.join(String(roomId));
    });

    // Listen for 'send-message' event with payload { senderId, receiverId, content, senderType? }
    socket.on(
      "send-message",
      async (payload: {
        senderId: number;
        receiverId: number;
        content: string;
        senderType?: "USER" | "ADMIN" | string;
      }) => {
        try {
          const { senderId, receiverId, content } = payload;
          const senderType = payload.senderType ?? "USER";

          // Ensure required fields are present
          if (!senderId || !receiverId || !content) {
            socket.emit("error", { message: "Missing message fields" });
            return;
          }

          // Create message in DB — include senderType as required by Prisma schema
          const savedMsg = await prisma.message.create({
            data: {
              senderId,
              receiverId,
              content,
              senderType, // must match your Prisma enum or string field
            },
          });

          // Emit to both sender and receiver rooms (or their sockets)
          io.to(String(receiverId)).emit("new-message", savedMsg);
          io.to(String(senderId)).emit("new-message", savedMsg);
        } catch (err) {
          console.error("socket send-message error:", err);
          socket.emit("error", { message: "Message send failed" });
        }
      }
    );
  });

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
  