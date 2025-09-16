// pages/api/questionnaires/submit.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // --- 1) Get logged-in user from session ---
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(session.user.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID in session" });
    }

    // --- 2) Extract fields from request body ---
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

    // --- 3) Validate required fields ---
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!projectType) missing.push("projectType");
    if (!description) missing.push("description");
    if (!budget) missing.push("budget");
    if (!timeline) missing.push("timeline");

    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    // --- 4) Create questionnaire linked to the current user ---
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
    console.error("Error submitting questionnaire:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
