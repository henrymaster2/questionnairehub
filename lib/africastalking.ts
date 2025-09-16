// lib/africastalking.ts
import africastalking from "africastalking";

const africastalkingClient = africastalking({
  apiKey: process.env.AT_API_KEY as string, // Your API key (from .env)
  username: process.env.AT_USERNAME as string, // "sandbox" for testing, or your prod username
});

export default africastalkingClient;
