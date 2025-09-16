// pages/api/send-sms.ts
import type { NextApiRequest, NextApiResponse } from "next";
import africastalking from "africastalking";

const at = africastalking({
  apiKey: process.env.AT_API_KEY as string,   // Your Africa's Talking API key
  username: process.env.AT_USERNAME as string // "sandbox" or your production username
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: "phoneNumber and message are required" });
    }

    // Ensure the phone number is in international format e.g. +2547XXXXXXXX
    if (!phoneNumber.startsWith("+")) {
      return res.status(400).json({ error: "Phone number must be in international format starting with +" });
    }

    const sms = at.SMS;

    const response = await sms.send({
      to: [phoneNumber],
      message,
      from: process.env.AT_SENDER_ID || "sandbox" // default to "sandbox" if not set
    });

    return res.status(200).json({ success: true, response });
  } catch (error: any) {
    console.error("SMS error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
