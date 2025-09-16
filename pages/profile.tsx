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
  profilePic?: string; // URL or base64
};

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    }

    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

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

  const handleSaveProfilePic = () => {
    if (!selectedImage) return;
    // Implement backend upload logic here
    alert("Profile picture saved successfully!");
    setUser((prev) => (prev ? { ...prev, profilePic: preview || "" } : prev));
    setSelectedImage(null);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading" || !user)
    return <p className="text-center mt-20 text-gray-600">Loading profile...</p>;

  const joinedDate = user.createdAt ? new Date(user.createdAt) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">My Profile</h1>

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-300 bg-gray-100 flex items-center justify-center">
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

          {/* Styled file input */}
          <label className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer text-sm transition">
            {selectedImage ? selectedImage.name : "Choose Profile Picture"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Save button */}
          {selectedImage && (
            <button
              onClick={handleSaveProfilePic}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm transition mt-2"
            >
              Save
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="w-full space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-900">{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Phone:</span>
            <span className="text-gray-900">{user.countryCode} {user.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Joined:</span>
            <span className="text-gray-900">
              {joinedDate && !isNaN(joinedDate.getTime())
                ? joinedDate.toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Logout */}
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
