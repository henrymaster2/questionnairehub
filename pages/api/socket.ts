// pages/api/socket.ts
import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { prisma } from "../../lib/prisma"; // your Prisma client

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      // Join a user room
      socket.on("join", (userId) => {
        socket.join(`user_${userId}`);
      });

      // Send message event
      socket.on("send_message", async ({ senderId, receiverId, content }) => {
        // Save to DB
        const message = await prisma.message.create({
          data: { senderId, receiverId, content },
        });

        // Emit to receiver
        io.to(`user_${receiverId}`).emit("receive_message", message);

        // Emit to sender to update their UI
        io.to(`user_${senderId}`).emit("receive_message", message);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
