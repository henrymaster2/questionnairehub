// pages/api/questionnaires/user.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient, Questionnaire, User } from "@prisma/client";

const prisma = new PrismaClient();

// Typed user session
type SessionUser = {
  id: number;
  isAdmin: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as SessionUser | undefined;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let questionnaires: (Questionnaire & { user?: User })[];

    if (user.isAdmin) {
      // Admin: fetch all questionnaires with user info
      questionnaires = await prisma.questionnaire.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true },
      });
    } else {
      // Regular user: fetch only their questionnaires
      questionnaires = await prisma.questionnaire.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { user: true },
      });
    }

    // Map to include readable data for frontend
    const mapped = questionnaires.map((q) => ({
      id: q.id,
      name: q.name,
      email: q.email,
      phone: q.user?.phone || "", // fetch phone from related user
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
