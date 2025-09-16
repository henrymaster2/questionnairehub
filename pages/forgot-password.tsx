// pages/forgot-password.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ Show backend error message clearly
        setError(data.error || "Something went wrong.");
      } else {
        setMessage(data.message || "Password reset link sent! Check your email.");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex justify-end items-center mb-12"
      >
        <nav>
          <ul className="flex gap-4 md:gap-6 text-gray-700 text-center">
            <li className="hover:text-blue-800 transition">
              <Link href="/login" className="block px-2 py-1">
                Log In
              </Link>
            </li>
            <li className="hover:text-blue-800 transition">
              <Link href="/signup" className="block px-2 py-1">
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </motion.header>

      {/* Forgot Password Form */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-lg mx-auto px-6 py-10 rounded-lg bg-gray-50 shadow-lg"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-blue-800 text-center">
          Forgot Password
        </h2>

        {/* ✅ Show error or success */}
        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}
        {message && (
          <p className="text-green-600 mb-4 text-center font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your email
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-lg font-semibold transition`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Log In
          </Link>
        </p>
      </motion.section>
    </div>
  );
}
