// pages/signup.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react"; // eye icons

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+254",
    phone: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const validatePassword = (password: string) => {
    // strong password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      alert("Please use a strong password before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        alert(`Signup failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed: Server error");
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
            href="/login"
            className="px-4 py-2 rounded-full neon-btn text-sm sm:text-base"
          >
            Log In
          </Link>
        </nav>
      </motion.header>

      {/* Signup Form */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-lg mx-auto w-full px-8 py-10 rounded-2xl bg-black/40 backdrop-blur-md shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-cyan-300 drop-shadow-md">
          Create Your Account
        </h2>

        {success ? (
          <p className="text-green-400 text-center font-semibold text-lg">
            Signup successful! Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Phone Number
              </label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="px-3 py-3 rounded-l-lg bg-white/10 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                >
                  <option value="+254">🇰🇪 +254</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                  value={formData.phone}
                  placeholder="712345678"
                  pattern="[0-9]{7,15}"
                  className="w-full px-4 py-3 rounded-r-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Enter your number without country code (e.g. 712345678).
              </p>
            </div>

            {/* Password */}
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
              {passwordError && (
                <p className="text-red-400 text-sm mt-2">{passwordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-lg flex justify-center items-center gap-3 transition-all neon-btn"
            >
              Sign Up
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-300 hover:underline">
              Log In
            </Link>
          </p>
        )}
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
      `}</style>
    </div>
  );
}
