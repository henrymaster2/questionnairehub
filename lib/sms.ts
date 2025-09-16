// lib/sms.ts
import africastalking from "africastalking";

const africasTalking = africastalking({
  apiKey: process.env.AT_API_KEY!,     // from dashboard
  username: process.env.AT_USERNAME!,  // usually "sandbox" for testing
});

const sms = africasTalking.SMS;

export async function sendWelcomeSMS(phone: string, name: string) {
  try {
    const response = await sms.send({
      to: [phone],
      message: `Hello ${name}, your account has been created successfully! 🎉`,
      from: process.env.AT_SENDER_ID || "", // optional, depends on setup
    });
    console.log("SMS sent:", response);
    return response;
  } catch (err) {
    console.error("SMS error:", err);
    throw err;
  }
}
