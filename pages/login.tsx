// pages/login.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier: formData.identifier,
        password: formData.password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionData?.user?.isAdmin) {
          router.push("/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-teal-800 to-cyan-700 text-white px-6 py-10">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-center mb-12"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">
          Questionnaire Hub
        </h1>
        <nav>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-full neon-btn text-sm sm:text-base"
          >
            Sign Up
          </Link>
        </nav>
      </motion.header>

      {/* Login Form */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-lg mx-auto w-full px-8 py-10 rounded-2xl bg-black/40 backdrop-blur-md shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-cyan-300 drop-shadow-md">
          Log In
        </h2>

        {error && (
          <p className="text-red-400 mb-4 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Email or Phone Number
            </label>
            <input
              type="text"
              name="identifier"
              onChange={handleChange}
              value={formData.identifier}
              placeholder="Enter your email or phone"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none"
              required
            />
          </div>

          {/* Password with eye toggle */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-cyan-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-cyan-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-lg flex justify-center items-center gap-3 transition-all neon-btn ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <span className="loader">
                  <svg viewBox="0 0 80 80">
                    <circle id="test" cx="40" cy="40" r="32"></circle>
                  </svg>
                </span>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-cyan-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.section>

      {/* Extra Styling */}
      <style jsx>{`
        .neon-btn {
          background: transparent;
          border: 2px solid #22d3ee;
          box-shadow: 0 0 10px #22d3ee, 0 0 20px #0891b2;
          color: #fff;
        }
        .neon-btn:hover {
          box-shadow: 0 0 20px #a855f7, 0 0 40px #22d3ee;
          border-color: #a855f7;
        }

        .loader {
          --path: white;
          --dot: #f40af0;
          --duration: 2.5s;
          width: 20px;
          height: 20px;
          position: relative;
        }
        .loader:before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          position: absolute;
          background: var(--dot);
          top: 9px;
          left: 9px;
          transform: translate(-18px, -18px);
          animation: dotCircle var(--duration) linear infinite;
        }
        .loader svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .loader svg circle {
          fill: none;
          stroke: var(--path);
          stroke-width: 5px;
          stroke-linecap: round;
          stroke-dasharray: 150 50 150 50;
          stroke-dashoffset: 75;
          animation: pathCircle var(--duration) linear infinite;
        }

        @keyframes pathCircle {
          25% {
            stroke-dashoffset: 125;
          }
          50% {
            stroke-dashoffset: 175;
          }
          75% {
            stroke-dashoffset: 225;
          }
          100% {
            stroke-dashoffset: 275;
          }
        }
        @keyframes dotCircle {
          25% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(18px, -18px);
          }
          75% {
            transform: translate(0, -36px);
          }
          100% {
            transform: translate(-18px, -18px);
          }
        }
      `}</style>
    </div>
  );
}
