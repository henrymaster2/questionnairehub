// pages/profile.tsx
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  createdAt: string | null;
  profilePic?: string;
};

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchUser();
  }, [status]);

  // Preview selected image
  useEffect(() => {
    if (!selectedImage) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSaveProfilePic = async () => {
    if (!selectedImage) return;
    setLoading(true);

    try {
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (typeof reader.result === "string") resolve(reader.result);
          };
          reader.onerror = (error) => reject(error);
        });

      const base64Image = await toBase64(selectedImage);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: base64Image }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setUser(data.user);
      setSelectedImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading" || !user)
    return <p className="text-center mt-20 text-gray-300">Loading profile...</p>;

  const joinedDate = user.createdAt ? new Date(user.createdAt) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-br from-indigo-900 via-teal-800 to-cyan-700 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-cyan-300 drop-shadow-md">
        My Profile
      </h1>

      <div className="bg-black/40 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl p-8 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-cyan-300 bg-gray-100 flex items-center justify-center">
            {preview || user.profilePic ? (
              <img
                src={preview || user.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-3xl">👤</span>
            )}
          </div>

          <label className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg cursor-pointer text-sm transition">
            {selectedImage ? selectedImage.name : "Choose Profile Picture"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {selectedImage && (
            <button
              onClick={handleSaveProfilePic}
              disabled={loading}
              className={`bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm transition mt-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="w-full space-y-4 text-gray-200">
          <div className="flex justify-between">
            <span className="font-semibold">Name:</span>
            <span>{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{user.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Joined:</span>
            <span>
              {joinedDate && !isNaN(joinedDate.getTime())
                ? joinedDate.toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
