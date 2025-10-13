// pages/updates.tsx
import Link from "next/link";
import { motion } from "framer-motion";

export default function Updates() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
      >
        Updates
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center max-w-lg w-full"
      >
        <p className="text-lg md:text-xl mb-4">🚧 No updates right now</p>
        <p className="text-sm text-gray-300">
          Stay connected — new features and announcements will appear here soon!
        </p>
      </motion.div>

      <Link
        href="/dashboard"
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition duration-300"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
