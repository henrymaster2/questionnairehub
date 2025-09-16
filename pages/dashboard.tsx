// pages/dashboard.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
}

interface Questionnaire {
  id: number;
  name: string;
  email: string;
  projectType: string;
  description: string;
  preferredTech?: string;
  budget: string;
  timeline: string;
  communication: string;
  backendNeeded: boolean;
  hostingDeployment: boolean;
  additionalInfo?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // Fetch submitted questionnaires
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const res = await fetch("/api/questionnaires/user", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setQuestionnaires(data.questionnaires || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaires();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 sm:px-6">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-center mb-8"
      >
        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg text-blue-800 font-semibold hover:bg-blue-200 transition"
          >
            ☰ Menu
          </button>

          {menuOpen && (
            <div className="absolute mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <ul className="flex flex-col text-gray-700">
                <li>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-blue-50">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/questionnaire"
                    className="block px-4 py-2 hover:bg-blue-50"
                  >
                    Fill the Questionnaire
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="block px-4 py-2 hover:bg-blue-50">
                    Chat with Developers
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="block px-4 py-2 hover:bg-blue-50">
                    Get Help
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold text-blue-800">Dashboard</h1>
      </motion.header>

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 rounded-xl shadow-md border border-gray-200 bg-gray-50 mb-6"
      >
        <h2 className="text-2xl font-semibold text-blue-800 mb-2">
          Welcome Back{user ? `, ${user.name}` : ""}!
        </h2>
        <p className="text-gray-600">
          Use the menu to fill a new questionnaire or chat with developers.
        </p>
      </motion.section>

      {/* Submitted Questionnaires Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 rounded-xl shadow-md border border-gray-200 bg-gray-50"
      >
        <h3 className="text-xl font-semibold text-blue-800 mb-4">
          Your Submitted Questionnaires
        </h3>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : questionnaires.length === 0 ? (
          <p className="text-gray-600">You haven’t submitted any questionnaires yet.</p>
        ) : (
          <div className="space-y-4">
            {questionnaires.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-lg border border-gray-200 shadow-sm bg-white"
              >
                <p><strong>Name:</strong> {q.name}</p>
                <p><strong>Email:</strong> {q.email}</p>
                <p><strong>Project Type:</strong> {q.projectType}</p>
                <p><strong>Description:</strong> {q.description}</p>
                {q.preferredTech && <p><strong>Technologies:</strong> {q.preferredTech}</p>}
                <p><strong>Budget:</strong> {q.budget}</p>
                <p><strong>Timeline:</strong> {q.timeline}</p>
                <p><strong>Communication:</strong> {q.communication}</p>
                <p><strong>Backend Needed:</strong> {q.backendNeeded ? "Yes" : "No"}</p>
                <p><strong>Hosting Deployment:</strong> {q.hostingDeployment ? "Yes" : "No"}</p>
                {q.additionalInfo && <p><strong>Additional Info:</strong> {q.additionalInfo}</p>}
                <p className="text-sm text-gray-500">
                  Submitted on: {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
