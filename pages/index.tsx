/*pages/index.tsx*/
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-10 sm:mb-12 gap-4 sm:gap-0"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-blue-800 rounded-md px-2 py-1 bg-blue-100 text-center sm:text-left">
          Questionnaire Hub
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-center">
            <li>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-medium text-sm sm:text-base"
              >
                Log In
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm sm:text-base"
              >
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
        className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto px-4 sm:px-6 rounded-lg bg-gray-50 shadow-lg py-8 sm:py-10"
      >
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 text-blue-800">
          Welcome
        </h2>
        <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
          This is where what you have in mind becomes real. Log in, create an account, and feel right at home. 
          Here, your thoughts matter — every question you create can inspire, connect, and solve problems.
        </p>
      </motion.section>

      {/* Sections */}
      <section className="max-w-4xl mx-auto space-y-8 sm:space-y-10 px-2 sm:px-0">
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
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h3 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 text-blue-700">
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
        className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-500 px-2"
      >
        Get contacts inside the web
      </motion.footer>
    </div>
  );
}
