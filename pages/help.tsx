import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Get Help
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-6">
          Need assistance? You can contact us via email or start a chat instantly.
        </p>

        {/* Contact Info */}
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:masterhenry681@gmail.com"
              className="text-blue-600 hover:underline"
            >
              masterhenry681@gmail.com
            </a>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4">
          {/* WhatsApp Chat Button */}
          <a
            href="https://wa.me/254759027692"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            💬 Chat on WhatsApp
          </a>

          {/* Chat with Admin (Links to Chat with Developers) */}
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            💻 Chat with Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
