// pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) return res.status(401).json({ error: "Not authenticated" });

    if (req.method === "POST") {
      const { content, receiverId, senderType } = req.body;
      if (!content) return res.status(400).json({ error: "Message content is required" });

      let senderId: number | null = null;
      if (senderType === "USER") {
        senderId = Number(session.user.id);
      } else if (senderType === "ADMIN") {
        if (!session.user.isAdmin) return res.status(403).json({ error: "Not authorized as admin" });
        senderId = null;
      }

      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId: senderType === "ADMIN" ? Number(receiverId) : null,
          senderType,
        },
      });
      return res.status(201).json(message);
    }

    if (req.method === "GET") {
      let messages;
      if (session.user.isAdmin) {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        messages = await prisma.message.findMany({
          where: {
            OR: [
              { senderId: Number(userId), receiverId: null },
              { senderId: null, receiverId: Number(userId) },
            ],
          },
          orderBy: { createdAt: "asc" },
        });
      } else {
        const userId = Number(session.user.id);
        messages = await prisma.message.findMany({
          where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
          },
          orderBy: { createdAt: "asc" },
        });
      }
      return res.status(200).json(messages);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
