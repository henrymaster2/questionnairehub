/*pages/index.tsx*/
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 md:gap-0"
      >
        <h1 className="text-2xl font-bold text-blue-800 rounded-md px-2 py-1 bg-blue-100">
          Questionnaire Hub
        </h1>
        <nav>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 text-gray-700 text-center">
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

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-16 max-w-3xl mx-auto px-6 rounded-lg bg-gray-50 shadow-lg py-10"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-blue-800">
          Welcome
        </h2>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          This is where what you have in mind becomes real. Log in, create an account, and feel right at home. 
          Here, your thoughts matter — every question you create can inspire, connect, and solve problems.
        </p>
      </motion.section>

      {/* Sections */}
      <section className="max-w-4xl mx-auto space-y-10">
        {[
          {
            title: "Express Your Thoughts",
            desc: "Your ideas matter. Create custom questionnaires to share your knowledge, gather opinions, or spark meaningful discussions.",
          },
          {
            title: "Discover New Perspectives",
            desc: "Browse through a variety of questionnaires created by others. Learn from different viewpoints and uncover insights you never expected.",
          },
          {
            title: "Connect and Collaborate",
            desc: "Engage with people who share your curiosity. Build connections, exchange ideas, and grow your network through shared knowledge.",
          },
          {
            title: "Your Home for Ideas",
            desc: "Sign up today, log in when you’re ready, and feel at home in a space designed for thinkers, creators, and learners like you.",
          },
        ].map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-blue-700">
              {section.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">{section.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-16 text-center text-sm text-gray-500"
      >
        Get contacts inside the web
      </motion.footer>
    </div>
  );
}
