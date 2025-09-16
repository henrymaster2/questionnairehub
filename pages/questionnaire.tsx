// pages/questionnaire.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";

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
    technologies: "",             // maps to preferredTech
    budget: "",
    timeline: "",
    preferredCommunication: "",   // maps to communication (optional)
    hasBackend: false,            // maps to backendNeeded
    needHosting: false,           // maps to hostingDeployment
    extraNotes: "",               // maps to additionalInfo
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  // Fetch current user to prefill name/email
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        if (!session?.user) return;

        const userData: User = {
          id: session.user.id ? Number(session.user.id) : 0, // convert string to number safely
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  // Build payload that the API understands (names -> Prisma)
  const buildPayload = () => ({
    name: formData.name,
    email: formData.email,
    projectType: formData.projectType,
    description: formData.description,
    preferredTech: formData.technologies || null,
    budget: formData.budget,
    timeline: formData.timeline,
    communication: formData.preferredCommunication || null, // optional
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

      // Reset (keep name/email if they were prefilled)
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
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto p-6 rounded-xl shadow-md border border-gray-200 bg-gray-50"
      >
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Fill the Software Questionnaire
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Type of Software Needed</label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
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
            <label className="block mb-2 font-medium text-gray-700">Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
              placeholder="Briefly describe what you need, the problem it solves, and the goals."
              required
            />
          </div>

          {/* Preferred Technologies */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Preferred Technologies (optional)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, PostgreSQL, Flutter"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Budget (KSH) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Budget Range (KSH)</label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
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
            <label className="block mb-2 font-medium text-gray-700">Timeline</label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select...</option>
              <option value="1month">Within 1 Month</option>
              <option value="1-3months">1 – 3 Months</option>
              <option value="3-6months">3 – 6 Months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Preferred Communication (optional) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Preferred Communication</label>
            <select
              name="preferredCommunication"
              value={formData.preferredCommunication}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
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
              className="h-4 w-4 text-blue-600"
            />
            <label className="text-gray-700">Do you require backend functionality?</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="needHosting"
              checked={formData.needHosting}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <label className="text-gray-700">Do you need hosting & deployment support?</label>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Additional Notes</label>
            <textarea
              name="extraNotes"
              value={formData.extraNotes}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
              placeholder="Anything else we should know?"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold shadow transition disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting..." : "Submit Questionnaire"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 font-semibold text-center ${
              status === "submitted" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-700"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
