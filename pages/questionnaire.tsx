// pages/questionnaire.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Questionnaire() {
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    description: "",
    technologies: "",
    budget: "",
    timeline: "",
    preferredCommunication: "",
    hasBackend: false,
    needHosting: false,
    extraNotes: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        if (!session?.user) return;

        const userData: User = {
          id: session.user.id ? Number(session.user.id) : 0,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
        };

        setUser(userData);
        setFormData((prev) => ({
          ...prev,
          name: userData.name,
          email: userData.email,
        }));
      } catch (err) {
        console.error("Error fetching session user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const buildPayload = () => ({
    name: formData.name,
    email: formData.email,
    projectType: formData.projectType,
    description: formData.description,
    preferredTech: formData.technologies || null,
    budget: formData.budget,
    timeline: formData.timeline,
    communication: formData.preferredCommunication || null,
    backendNeeded: formData.hasBackend,
    hostingDeployment: formData.needHosting,
    additionalInfo: formData.extraNotes || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const payload = buildPayload();

      const res = await fetch("/api/questionnaires/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to submit questionnaire");
      }

      setStatus("submitted");
      setMessage("✅ Questionnaire submitted successfully! (Pending Review)");

      setFormData((prev) => ({
        name: user?.name ?? "",
        email: user?.email ?? "",
        projectType: "",
        description: "",
        technologies: "",
        budget: "",
        timeline: "",
        preferredCommunication: "",
        hasBackend: false,
        needHosting: false,
        extraNotes: "",
      }));
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("❌ Something went wrong while submitting. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-teal-800 to-cyan-700 text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl p-8 rounded-2xl shadow-xl border border-white/20 bg-black/40 backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold text-cyan-300 mb-8 text-center drop-shadow-md">
          Fill the Software Questionnaire
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-900/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-900/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">
              Type of Software Needed
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
              required
            >
              <option value="">Select...</option>
              <option value="web">Web Application</option>
              <option value="mobile">Mobile App</option>
              <option value="desktop">Desktop Software</option>
              <option value="api">API / Backend Service</option>
              <option value="website">Website</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-900/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
              placeholder="Briefly describe your project..."
              required
            />
          </div>

          {/* Preferred Technologies */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">
              Preferred Technologies (optional)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, PostgreSQL, Flutter"
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-900/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">
              Budget Range (KSH)
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
              required
            >
              <option value="">Select...</option>
              <option value="0-20000">0 – 20,000</option>
              <option value="20000-50000">20,000 – 50,000</option>
              <option value="50000-100000">50,000 – 100,000</option>
              <option value="100000-200000">100,000 – 200,000</option>
              <option value="200000+">200,000+</option>
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">
              Timeline
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
              required
            >
              <option value="">Select...</option>
              <option value="1month">Within 1 Month</option>
              <option value="1-3months">1 – 3 Months</option>
              <option value="3-6months">3 – 6 Months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Preferred Communication */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">
              Preferred Communication
            </label>
            <select
              name="preferredCommunication"
              value={formData.preferredCommunication}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Select...</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="zoom">Zoom / Google Meet</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasBackend"
              checked={formData.hasBackend}
              onChange={handleChange}
              className="h-4 w-4 text-cyan-400 bg-black/40 border-white/30"
            />
            <label className="text-gray-200">
              Do you require backend functionality?
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="needHosting"
              checked={formData.needHosting}
              onChange={handleChange}
              className="h-4 w-4 text-cyan-400 bg-black/40 border-white/30"
            />
            <label className="text-gray-200">
              Do you need hosting & deployment support?
            </label>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block mb-2 font-medium text-cyan-200">
              Additional Notes
            </label>
            <textarea
              name="extraNotes"
              value={formData.extraNotes}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg border border-white/20 bg-gray-900/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
              placeholder="Anything else we should know?"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3 rounded-lg neon-btn font-semibold transition disabled:opacity-50"
          >
            {status === "submitting"
              ? "Submitting..."
              : "Submit Questionnaire"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 font-semibold text-center ${
              status === "submitted"
                ? "text-green-400"
                : status === "error"
                ? "text-red-400"
                : "text-gray-200"
            }`}
          >
            {message}
          </p>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <button className="px-6 py-2 neon-btn rounded-lg font-semibold transition">
              ⬅ Back to Dashboard
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Styles */}
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
        select option {
          background: #111827;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
