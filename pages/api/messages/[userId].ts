// pages/api/messages/[userId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]"; // adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // current user
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser) return res.status(404).json({ error: "User not found" });

  const otherId = Number(req.query.userId);
  if (!otherId) return res.status(400).json({ error: "Missing userId" });

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUser.id, receiverId: otherId },
        { senderId: otherId, receiverId: currentUser.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json(messages);
}
