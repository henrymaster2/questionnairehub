// pages/updates.tsx
import Link from "next/link";

export default function Updates() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Updates</h1>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center max-w-lg">
        <p className="text-lg md:text-xl mb-4">
          🚧 No updates right now
        </p>
        <p className="text-sm text-gray-300">
          Stay connected — new features and announcements will appear here soon!
        </p>
      </div>

      <Link
        href="dashboard"
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
