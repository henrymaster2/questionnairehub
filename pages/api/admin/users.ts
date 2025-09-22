// pages/api/admin/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) return res.status(401).json({ error: "Not authenticated" });

  // check admin
  const me = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!me || me.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  // fetch users (excluding admins)
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profilePic: true,
      createdAt: true,
      // last message time
      sentMessages: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const normalized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    lastMessageAt: u.sentMessages?.[0]?.createdAt ?? null,
    createdAt: u.createdAt,
  }));

  return res.status(200).json(normalized);
}
