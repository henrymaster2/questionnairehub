import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

type Message = {
  senderId: number;
  receiverId: number;
  content: string;
};

const onlineUsers = new Map<number, string>();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId: number) => {
    console.log(`User ${userId} joined`);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send_message", async (msg: Message) => {
    const { senderId, receiverId, content } = msg;

    const savedMsg = await prisma.message.create({
      data: { senderId, receiverId, content },
    });

    // Emit to receiver and sender
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit("receive_message", savedMsg);

    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId) io.to(senderSocketId).emit("receive_message", savedMsg);
  });

  socket.on("disconnect", () => {
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) onlineUsers.delete(userId);
    }
  });
});

httpServer.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});
