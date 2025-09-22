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
    // Get session from NextAuth
    const session = await getServerSession(req, res, authOptions);

    // If no session or no user email, return 401
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find the user in the database 
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        countryCode: true,
        profilePic: true, // adjust if your field name is different
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in /api/profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
