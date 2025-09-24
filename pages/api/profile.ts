// pages/api/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Disable caching to prevent 304 responses
    res.setHeader("Cache-Control", "no-store");

    // Get session from NextAuth
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = session.user.email;

    // -------------------- GET: Fetch profile --------------------
    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          countryCode: true,
          profilePic: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    }

    // -------------------- PUT: Update profile --------------------
    if (req.method === "PUT") {
      const { name, phone, countryCode, profilePic } = req.body;

      if (!name && !phone && !countryCode && !profilePic) {
        return res.status(400).json({ message: "No fields to update" });
      }

      const updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(countryCode && { countryCode }),
          ...(profilePic && { profilePic }),
        },
      });

      return res.status(200).json({ user: updatedUser });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in /api/profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
