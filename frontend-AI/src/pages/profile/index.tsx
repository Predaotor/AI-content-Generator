import React, { useEffect, useState } from "react";
import { fetchProfileData } from "@/utils/api";
import Link from "next/link";

interface SavedOutput {
  id: number;
  template_type: string;
  content: string;
  created_at: string;
}

interface Profile {
  username: string;
  email: string;
  tokens_used: number;
  saved_outputs: SavedOutput[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    fetchProfileData(token)
      .then(data => setProfile(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="text-red-400 p-4">{error}</div>;
  if (!profile) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-indigo-600 p-10 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Home Link */}
        <div className="flex justify-end mb-4">
          <Link href="/">
            <span className="text-indigo-200 hover:underline font-semibold cursor-pointer">
              Home
            </span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-6">User Profile</h1>

        <div className="bg-indigo-400 bg-opacity-30 rounded-lg p-6 mb-8 space-y-4 text-indigo-50 shadow-lg">
          <div className="flex justify-between border-b border-indigo-300 pb-2">
            <span className="font-semibold text-lg">Username</span>
            <span>{profile.username}</span>
          </div>
          <div className="flex justify-between border-b border-indigo-300 pb-2">
            <span className="font-semibold text-lg">Email</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-lg">Tokens Used Today</span>
            <span>{profile.tokens_used}</span>
          </div>
        </div>

        <h2 className="text-3xl font-semibold mb-5">Saved Outputs</h2>
        {profile.saved_outputs.length === 0 ? (
          <p className="text-indigo-200">No saved outputs yet.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {profile.saved_outputs.map(output => (
              <div
                key={output.id}
                className="bg-indigo-500 bg-opacity-50 rounded-md p-5 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="font-semibold text-xl capitalize mb-2 border-b border-indigo-300 pb-1">
                  {output.template_type.replace(/_/g, " ")}
                </h3>
                <p className="whitespace-pre-wrap mb-3 text-sm">
                  {output.content}
                </p>
                <small className="text-indigo-300">
                  Created:{" "}
                  {new Date(output.created_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
