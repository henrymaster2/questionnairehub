// pages/api/socket.ts
import { NextApiRequest } from "next";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import prisma from "@/lib/prisma";

type NextApiResponseWithSocket = any;

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  // Only initialize once
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const httpServer = res.socket.server as unknown as HTTPServer;
    const io = new IOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Map userId -> socket.id
    const userSocketMap = new Map<number, string>();
    const ADMIN_ID = Number(process.env.ADMIN_ID) || -1;

    io.on("connection", (socket) => {
      console.log("⚡ Socket connected:", socket.id);

      // Client should emit "join" with { userId }
      socket.on("join", (payload: { userId: number }) => {
        if (typeof payload?.userId !== "number") return;
        const { userId } = payload;
        userSocketMap.set(userId, socket.id);
        socket.join(`user_${userId}`);
        console.log(`✅ User ${userId} joined room user_${userId}`);
      });

      // ---- User -> Admin message ----
      socket.on("sendMessage", async (msg: { senderId: number; content: string }) => {
        try {
          const { senderId, content } = msg;
          if (!senderId || !content) return;

          const saved = await prisma.message.create({
            data: {
              senderId,
              receiverId: ADMIN_ID,
              content: String(content).trim(),
            },
          });

          // Emit to both
          io.to(`user_${ADMIN_ID}`).emit("message", saved);
          io.to(`user_${senderId}`).emit("message", saved);
        } catch (err) {
          console.error("❌ sendMessage error:", err);
        }
      });

      // ---- Admin -> User reply ----
      socket.on("adminReply", async (msg: { receiverId: number; content: string }) => {
        try {
          const { receiverId, content } = msg;
          if (!receiverId || !content) return;

          const saved = await prisma.message.create({
            data: {
              senderId: ADMIN_ID,
              receiverId,
              content: String(content).trim(),
            },
          });

          // Emit to both
          io.to(`user_${receiverId}`).emit("message", saved);
          io.to(`user_${ADMIN_ID}`).emit("message", saved);
        } catch (err) {
          console.error("❌ adminReply error:", err);
        }
      });

      socket.on("disconnect", () => {
        for (const [userId, sid] of userSocketMap.entries()) {
          if (sid === socket.id) {
            userSocketMap.delete(userId);
            console.log(`⚡ User ${userId} disconnected, removed mapping`);
            break;
          }
        }
      });
    });

    // Save io on server so it's reused
    res.socket.server.io = io;
  }

  res.end();
}
