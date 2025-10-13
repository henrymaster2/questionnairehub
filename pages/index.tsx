/* pages/index.tsx */
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // ✅ Added Link import
import {
  PencilSquareIcon,
  ChartBarIcon,
  ShareIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

const sections = [
  {
    title: "Express Your Thoughts",
    desc: "Your ideas matter. Create custom questionnaires to share your knowledge, gather opinions, or spark meaningful discussions.",
    bg: "linear-gradient(90deg, rgba(167,162,244,1) 0%, rgba(112,112,143,1) 35%, rgba(166,149,13,1) 100%, rgba(0,212,255,1) 100%)",
  },
  {
    title: "Discover New Perspectives",
    desc: "Browse through a variety of questionnaires created by others. Learn from different viewpoints and uncover insights you never expected.",
    bg: "linear-gradient(90deg, rgba(2,19,45,1) 4%, rgba(120,109,181,1) 49%, rgba(230,132,132,1) 100%, rgba(0,212,255,1) 100%)",
  },
  {
    title: "Connect and Collaborate",
    desc: "Engage with people who share your curiosity. Build connections, exchange ideas, and grow your network through shared knowledge.",
    bg: "linear-gradient(90deg, rgba(9,111,55,1) 0%, rgba(39,196,129,1) 49%, rgba(47,209,232,1) 100%, rgba(0,212,255,1) 100%)",
  },
  {
    title: "Your Home for Ideas",
    desc: "Sign up today, log in when you’re ready, and feel at home in a space designed for thinkers, creators, and learners like you.",
    bg: "linear-gradient(90deg, rgba(101,18,18,1) 0%, rgba(186,44,44,1) 49%, rgba(235,134,80,1) 100%, rgba(0,212,255,1) 100%)",
  },
];

const exclusiveIdeas = [
  { title: "Create Meaningful Questions", desc: "Build custom questionnaires that spark real engagement and help uncover valuable insights.", icon: PencilSquareIcon },
  { title: "Gain Real Insights", desc: "Analyze responses and discover patterns that can guide better decisions and deeper understanding.", icon: ChartBarIcon },
  { title: "Share Knowledge", desc: "Spread ideas that matter. Inspire others and let your thoughts reach a wider audience.", icon: ShareIcon },
  { title: "Grow Connections", desc: "Collaborate with others who think like you and expand your circle of meaningful relationships.", icon: UsersIcon },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typing animation for site title
  useEffect(() => {
    const text = "QQuestionnaire Hub";
    let i = 0;
    setTypedText("");
    setShowCursor(true);

    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + text.charAt(i));
      i++;
      if (i === text.length) {
        clearInterval(typingInterval);
        setTimeout(() => setShowCursor(false), 500);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  // Auto-change sections
  useEffect(() => {
    startProgress();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current]);

  const startProgress = () => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);

    let elapsed = 0;
    const duration = 5000;
    const step = 100;

    intervalRef.current = setInterval(() => {
      elapsed += step;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        setCurrent((prev) => (prev + 1) % sections.length);
      }
    }, step);
  };

  const active = sections[current];

  return (
    <div
      className="min-h-screen flex flex-col text-white transition-all duration-1000 font-[Inter,sans-serif]"
      style={{ background: active.bg }}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4">
        <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-wide flex items-center">
          {typedText}
          {showCursor && <span className="cursor">|</span>}
        </h1>
        <nav className="flex gap-2 sm:gap-4">
          <Link href="/login" className="px-4 sm:px-5 py-2 rounded-full font-semibold text-white neon-btn text-sm sm:text-base">
            Log In
          </Link>
          <Link href="/signup" className="px-4 sm:px-5 py-2 rounded-full font-semibold text-white neon-btn text-sm sm:text-base">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Top Half - Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center px-4 sm:px-6 text-center">
        <motion.h2
          key={active.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6"
        >
          {active.title}
        </motion.h2>
        <motion.p
          key={active.desc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-2xl text-sm sm:text-lg md:text-2xl leading-relaxed"
        >
          {active.desc}
        </motion.p>
      </main>

      {/* Bottom Half - Exclusive Ideas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-6 py-8 sm:py-10 bg-black/30 backdrop-blur-sm">
        {exclusiveIdeas.map((idea, idx) => {
          const Icon = idea.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 shadow-lg hover:shadow-2xl transition flex flex-col items-center text-center"
            >
              <Icon className="w-8 h-8 sm:w-12 sm:h-12 mb-3 text-yellow-300" />
              <h3 className="text-lg sm:text-2xl md:text-3xl font-semibold mb-3">
                {idea.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg opacity-90">
                {idea.desc}
              </p>
            </motion.div>
          );
        })}
      </section>

      {/* Progress Bars */}
      <div className="flex gap-2 px-4 sm:px-6 pb-4">
        {sections.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-2 bg-white/30 rounded cursor-pointer overflow-hidden"
            onClick={() => setCurrent(index)}
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index < current
                    ? "100%"
                    : index === current
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-2 pb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={star <= rating ? "yellow" : "none"}
            stroke="yellow"
            strokeWidth="2"
            className="w-6 sm:w-8 h-6 sm:h-8 cursor-pointer hover:scale-110 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-.99L12 2z"
            />
          </svg>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs sm:text-sm py-4 opacity-80">
        Get contacts inside the web
      </footer>

      {/* Extra Styling */}
      <style jsx>{`
        .neon-btn {
          background: transparent;
          border: 2px solid rgba(40, 240, 240, 1);
          box-shadow: 0 0 10px rgba(12, 168, 168, 1), 0 0 20px rgba(4, 92, 92, 1);
          transition: all 0.3s ease-in-out;
        }
        .neon-btn:hover {
          box-shadow: 0 0 20px #ff00de, 0 0 40px #0ff;
          border-color: #ff00de;
        }
        .cursor {
          margin-left: 2px;
          border-right: 3px solid white;
          animation: blink 0.7s infinite;
        }
        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}
