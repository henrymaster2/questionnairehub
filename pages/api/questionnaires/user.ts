// pages/api/questionnaires/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || typeof session.user?.id !== "number") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId: number = session.user.id;
    const isAdmin: boolean = !!session.user.isAdmin;

    let questionnaires;
    if (isAdmin) {
      questionnaires = await prisma.questionnaire.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      questionnaires = await prisma.questionnaire.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    }

    const mapped = questionnaires.map((q) => ({
      id: q.id,
      name: q.name,
      email: q.email,
      phone: q.userId ? q.userId.toString() : "",
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
    console.error("questionnaires/user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
