// pages/api/messages.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = Number(session.user.id);
    if (Number.isNaN(userId)) {
      return res.status(401).json({ error: "Invalid session user id" });
    }

    // Use only ADMIN_ID from env
    const ADMIN_ID = Number(process.env.ADMIN_ID);
    if (!ADMIN_ID) {
      return res.status(500).json({ error: "ADMIN_ID not configured" });
    }

    // POST: send message
    if (req.method === "POST") {
      const { receiverId, content } = req.body ?? {};
      const rid = Number(receiverId);

      if (!content || Number.isNaN(rid)) {
        return res.status(400).json({ error: "receiverId and content required" });
      }

      // Enforce rules: users can only send to admin, admin can send to anyone
      if (userId !== ADMIN_ID && rid !== ADMIN_ID) {
        return res.status(403).json({ error: "Users can only send messages to admin" });
      }

      const message = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId: rid,
          content: String(content).trim(),
        },
      });

      return res.status(200).json(message);
    }

    // GET: fetch conversation
    if (req.method === "GET") {
      let conversationUserId: number | null = null;

      if (req.query.userId) {
        conversationUserId = Number(req.query.userId);
        if (Number.isNaN(conversationUserId)) conversationUserId = null;
      } else {
        if (userId === ADMIN_ID) {
          return res.status(400).json({ error: "Admin must provide ?userId=" });
        } else {
          conversationUserId = userId;
        }
      }

      if (!conversationUserId) {
        return res.status(400).json({ error: "Invalid conversation userId" });
      }

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: conversationUserId, receiverId: ADMIN_ID },
            { senderId: ADMIN_ID, receiverId: conversationUserId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      return res.status(200).json(messages);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("messages API error:", err);
    return res.status(500).json({ error: err.message ?? "Internal server error" });
  }
}
