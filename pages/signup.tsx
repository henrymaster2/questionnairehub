// pages/signup.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+254",
    phone: "",
    password: "",
  });
  const [success, setSuccess] = useState(false); // track signup success

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // send countryCode + phone separately
      });

      if (res.ok) {
        setSuccess(true); // show success message
        setTimeout(() => {
          router.push("/login"); // redirect automatically
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
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
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
          </ul>
        </nav>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-lg mx-auto px-6 py-10 rounded-lg bg-gray-50 shadow-lg"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-blue-800 text-center">
          Create Your Account
        </h2>

        {success ? (
          <p className="text-green-600 text-center font-semibold text-lg">
            Signup successful! Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your number without country code (e.g. 712345678).
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Log In
            </Link>
          </p>
        )}
      </motion.section>
    </div>
  );
}
