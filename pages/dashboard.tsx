// pages/dashboard.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  const [user, setUser] = useState<User | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        const res = await fetch("/api/questionnaires/user", {
          credentials: "include",
        });
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
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-teal-800 to-cyan-700 text-white relative">
      {/* Sidebar (desktop) */}
      <motion.aside
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col w-64 h-screen px-6 py-10 bg-black/60 backdrop-blur-md border-r border-white/20"
      >
        <h2 className="text-2xl font-bold text-cyan-300 mb-8">Menu</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/profile" className="hover:text-cyan-400">
            Profile
          </Link>
          <Link href="/questionnaire" className="hover:text-cyan-400">
            Fill the Questionnaire
          </Link>
          <Link href="/chat" className="hover:text-cyan-400">
            Chat with Developers
          </Link>
          <Link href="/help" className="hover:text-cyan-400">
            Get Help
          </Link>
          <Link href="/updates" className="hover:text-cyan-400">
            Updates
          </Link>
        </nav>
      </motion.aside>

      {/* Mobile Sidebar (slide-in) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 w-64 h-full bg-black/90 backdrop-blur-md z-50 px-6 py-10 border-r border-white/20 md:hidden"
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-right w-full text-gray-300 hover:text-white mb-6"
            >
              ✖ Close
            </button>
            <h2 className="text-2xl font-bold text-cyan-300 mb-8">Menu</h2>
            <nav className="flex flex-col space-y-4">
              <Link href="/profile" className="hover:text-cyan-400" onClick={() => setSidebarOpen(false)}>
                Profile
              </Link>
              <Link href="/questionnaire" className="hover:text-cyan-400" onClick={() => setSidebarOpen(false)}>
                Fill the Questionnaire
              </Link>
              <Link href="/chat" className="hover:text-cyan-400" onClick={() => setSidebarOpen(false)}>
                Chat with Developers
              </Link>
              <Link href="/help" className="hover:text-cyan-400" onClick={() => setSidebarOpen(false)}>
                Get Help
              </Link>
              <Link href="/updates" className="hover:text-cyan-400" onClick={() => setSidebarOpen(false)}>
                Updates
              </Link>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 px-6 py-10 w-full">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-10"
        >
          {/* Mobile Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden px-4 py-2 rounded-lg neon-btn font-semibold"
          >
            ☰ Menu
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">
            Dashboard
          </h1>
        </motion.header>

        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-2xl shadow-xl border border-white/20 bg-black/40 backdrop-blur-md mb-6"
        >
          <h2 className="text-2xl font-semibold text-cyan-300 mb-2 drop-shadow-md">
            Welcome Back{user ? `, ${user.name} 🙂` : ""}!
          </h2>
          <p className="text-gray-200">
            Use the menu to fill a new questionnaire or chat with developers.
          </p>
        </motion.section>

        {/* Submitted Questionnaires Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-2xl shadow-xl border border-white/20 bg-black/40 backdrop-blur-md"
        >
          <h3 className="text-xl font-semibold text-cyan-300 mb-4 drop-shadow-md">
            Your Submitted Questionnaires
          </h3>

          {loading ? (
            <p className="text-gray-300">Loading...</p>
          ) : questionnaires.length === 0 ? (
            <p className="text-gray-300">
              You haven’t submitted any questionnaires yet.
            </p>
          ) : (
            <div className="space-y-4">
              {questionnaires.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-white/20 shadow-md bg-white/10 text-white"
                >
                  <p>
                    <strong>Name:</strong> {q.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {q.email}
                  </p>
                  <p>
                    <strong>Project Type:</strong> {q.projectType}
                  </p>
                  <p>
                    <strong>Description:</strong> {q.description}
                  </p>
                  {q.preferredTech && (
                    <p>
                      <strong>Technologies:</strong> {q.preferredTech}
                    </p>
                  )}
                  <p>
                    <strong>Budget:</strong> {q.budget}
                  </p>
                  <p>
                    <strong>Timeline:</strong> {q.timeline}
                  </p>
                  <p>
                    <strong>Communication:</strong> {q.communication}
                  </p>
                  <p>
                    <strong>Backend Needed:</strong>{" "}
                    {q.backendNeeded ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Hosting Deployment:</strong>{" "}
                    {q.hostingDeployment ? "Yes" : "No"}
                  </p>
                  {q.additionalInfo && (
                    <p>
                      <strong>Additional Info:</strong> {q.additionalInfo}
                    </p>
                  )}
                  <p className="text-sm text-gray-400">
                    Submitted on: {new Date(q.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

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
