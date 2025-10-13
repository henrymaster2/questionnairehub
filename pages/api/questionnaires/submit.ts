// pages/api/questionnaires/submit.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(session.user.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID in session" });
    }

        const {
      name,
      email,
      projectType,
      description,
      preferredTech = null,
      budget,
      timeline,
      communication = null,
      backendNeeded = false,
      hostingDeployment = false,
      additionalInfo = null,
    } = req.body;

        const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!projectType) missingFields.push("projectType");
    if (!description) missingFields.push("description");
    if (!budget) missingFields.push("budget");
    if (!timeline) missingFields.push("timeline");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    
    const questionnaire = await prisma.questionnaire.create({
      data: {
        userId,
        name,
        email,
        projectType,
        description,
        preferredTech,
        budget,
        timeline,
        communication,
        backendNeeded: Boolean(backendNeeded),
        hostingDeployment: Boolean(hostingDeployment),
        additionalInfo,
      },
    });

    
    return res.status(201).json({
      message: "Questionnaire submitted successfully",
      questionnaire,
    });
  } catch (error) {
    console.error("❌ Error submitting questionnaire:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
