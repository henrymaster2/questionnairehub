// pages/help.tsx
import Link from "next/link";
import { motion } from "framer-motion";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-teal-800 to-cyan-700 text-white px-6 py-10">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center mb-10"
      >
        <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">
          Get Help 🤝
        </h1>
      </motion.header>

      {/* Card Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 rounded-2xl shadow-xl border border-white/20 bg-black/40 backdrop-blur-md max-w-md mx-auto w-full"
      >
        {/* Description */}
        <p className="text-center text-gray-200 mb-6">
          Need assistance? You can contact us via email or start a chat instantly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          {/* Email */}
          <a
            href="mailto:masterhenry681@gmail.com"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl contact-btn font-semibold text-white"
          >
            📧 Email Us
          </a>

          {/* WhatsApp Chat */}
          <a
            href="https://wa.me/254759027692"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl contact-btn font-semibold text-white"
          >
            💬 Chat on WhatsApp
          </a>

          {/* Chat with Admin */}
          <Link
            href="/chat"
            rel="noopener no referrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl contact-btn font-semibold text-white"
          >
            💻 Chat with Admin
          </Link>
        </div>
      </motion.section>

      {/* Button Styling */}
      <style jsx>{`
        .contact-btn {
          background: #088636ff;
          border: 2px solid #1c8797ff;
          box-shadow: 0 0 10px #107e8fff, 0 0 20px #0891b2;
          transition: all 0.3s ease;
        }
        .contact-btn:hover {
          background: #0e9745ff;
          box-shadow: 0 0 20px #a855f7, 0 0 40px #22d3ee;
          border-color: #a855f7;
        }
      `}</style>
    </div>
  );
}
