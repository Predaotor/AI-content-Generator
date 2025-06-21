import Link from 'next/link';
import Image from 'next/image';
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
    <div className="p-10 min-h-screen text-white bg-indigo-600">
      <div className="mx-auto max-w-4xl">
        {/* Home Link */}
        <div className="flex justify-end mb-4">
          <Link href="/">
            <span className="font-semibold text-indigo-200 cursor-pointer hover:underline">
              Home
            </span>
          </Link>
        </div>

        <h1 className="mb-6 text-4xl font-bold">User Profile</h1>

        {/* User Card with Logo */}
        <div className="p-6 mb-8 text-indigo-50 bg-indigo-400 bg-opacity-30 rounded-lg border-2 border-indigo-300 shadow-lg">
          <div className="flex items-center pb-4 mb-4 space-x-4 border-b border-indigo-300">
            <div className="flex-shrink-0">
              <Image
                src="/assets/images/user_logo.png"
                alt="User Logo"
                width={48}
                height={48}
                className="rounded-full border-2 border-indigo-200"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
              <p className="text-indigo-200">Welcome back!</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b border-indigo-300">
              <span className="text-lg font-semibold">Email</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Tokens Used Today</span>
              <span>{profile.tokens_used}</span>
            </div>
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
                className="p-5 rounded-md shadow-md transition-shadow duration-300 bg-indigo-500/50 hover:shadow-xl"
              >
                <h3 className="pb-1 mb-2 text-xl font-semibold capitalize border-b border-indigo-300">
                  {output.template_type.replace(/_/g, ' ')}
                </h3>
                <p className="mb-3 text-sm whitespace-pre-wrap">
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
