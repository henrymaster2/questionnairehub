// pages/api/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    console.log("📩 Forgot password request for:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "No account found with that email." });
    }

  
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3000";

    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>You requested to reset your password. Click the link below to set a new password:</p>
          <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
          <p>This link will expire in 1 hour.</p>
          <br/>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Password reset email sent to:", email);
    return res.status(200).json({ message: "Password reset link sent successfully." });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}
