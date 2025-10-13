import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(session.user.id);
    const isAdmin = Boolean(session.user.isAdmin);
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
      phone: q.userId?.toString() || "",
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
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
