// pages/api/questionnaires/user.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !(session.user as any).id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = (session.user as any).id;
    const isAdmin = (session.user as any).isAdmin;

    let questionnaires;

    if (isAdmin) {
      // Admin: fetch all questionnaires
      questionnaires = await prisma.questionnaire.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Regular user: fetch only their questionnaires
      questionnaires = await prisma.questionnaire.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: "desc" },
      });
    }

    // Map to include readable data for frontend
    const mapped = questionnaires.map((q) => ({
      id: q.id,
      name: q.name,
      email: q.email,
      phone: q.userId ? q.userId.toString() : "", // optional, can include phone from user join if needed
      projectType: q.projectType,
      description: q.description,
      preferredTech: q.preferredTech,
      budget: q.budget,
      timeline: q.timeline,
      communication: q.communication,
      backendNeeded: q.backendNeeded,
      hostingDeployment: q.hostingDeployment,
      additionalInfo: q.additionalInfo,
      createdAt: q.createdAt,
    }));

    return res.status(200).json({ questionnaires: mapped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
