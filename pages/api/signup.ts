// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, countryCode, phone, password } = req.body;

    if (!name || !email || !countryCode || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return res.status(409).json({ message: "Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        countryCode,
        phone,
        password: hashedPassword,
        profilePic: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        countryCode: true,
        phone: true,
        profilePic: true,
        createdAt: true,
      },
    });

    try {
      const fullPhone = `${countryCode}${phone}`;
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          message: `Hi ${newUser.name}, your Earnify account has been created successfully! 🎉`,
        }),
      });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
    }

    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
