import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { fetchProfileData } from '@/utils/api';

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
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Not logged in');
      return;
    }

    fetchProfileData(token)
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="p-4 text-red-400">{error}</div>;
  if (!profile) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-indigo-600 p-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Home Link */}
        <div className="mb-4 flex justify-end">
          <Link href="/">
            <span className="cursor-pointer font-semibold text-indigo-200 hover:underline">
              Home
            </span>
          </Link>
        </div>

        <h1 className="mb-6 text-4xl font-bold">User Profile</h1>

        <div className="mb-8 space-y-4 rounded-lg bg-indigo-400 bg-opacity-30 p-6 text-indigo-50 shadow-lg">
          <div className="flex justify-between border-b border-indigo-300 pb-2">
            <span className="text-lg font-semibold">Username</span>
            <span>{profile.username}</span>
          </div>
          <div className="flex justify-between border-b border-indigo-300 pb-2">
            <span className="text-lg font-semibold">Email</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Tokens Used Today</span>
            <span>{profile.tokens_used}</span>
          </div>
        </div>

        <h2 className="mb-5 text-3xl font-semibold">Saved Outputs</h2>
        {profile.saved_outputs.length === 0 ? (
          <p className="text-indigo-200">No saved outputs yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {profile.saved_outputs.map((output) => (
              <div
                key={output.id}
                className="rounded-md bg-indigo-500/50  p-5 shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <h3 className="mb-2 border-b border-indigo-300 pb-1 text-xl font-semibold capitalize">
                  {output.template_type.replace(/_/g, ' ')}
                </h3>
                <p className="mb-3 whitespace-pre-wrap text-sm">
                  {output.content}
                </p>
                <small className="text-indigo-300">
                  Created: {new Date(output.created_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
