import Link from 'next/link';
import { useRouter } from 'next/router'; // ✅ import useRouter
import { useState, useEffect, useRef } from 'react';

import { registerUser, googleAuth } from '../utils/api';

const SignUpForm = () => {
  const router = useRouter(); // ✅ get router instance

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const googleDivRef = useRef<HTMLDivElement>(null);
  // @ts-ignore
  declare global { interface Window { google: any; } }

  useEffect(() => {
    if (!document.getElementById('google-identity')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-identity';
      document.body.appendChild(script);
      script.onload = renderButton;
    } else {
      renderButton();
    }
    function renderButton() {
      if ((window as any).google && googleDivRef.current) {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });
        (window as any).google.accounts.id.renderButton(googleDivRef.current, {
          theme: 'outline',
          size: 'large',
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  async function handleCredentialResponse(response: any) {
    try {
      const data = await googleAuth(response.credential);
      console.log('Google auth response:', data); // Debug log
      if (data.user && data.token) {
        setMessage('Google registration successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Google auth error:', err); // Debug log
      setMessage(err.message || 'Google sign up failed');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setMessage('Registration successful! Redirecting to Sign In...');
      setTimeout(() => {
        router.push('/signin'); // ✅ redirect after a delay
      }, 1500);
    } catch (err: any) {
      setMessage(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="p-8 mx-auto mt-10 max-w-md bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-indigo-600">
        Sign Up
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mt-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="p-3 mt-2 w-full rounded-md border border-gray-300"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Username */}
        <div className="mt-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Choose a username"
            className="p-3 mt-2 w-full rounded-md border border-gray-300"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="p-3 mt-2 w-full rounded-md border border-gray-300"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="py-3 w-full text-white bg-indigo-600 rounded-md"
          >
            Sign Up
          </button>
        </div>
      </form>

      {/* Google Sign-Up Button */}
      <div className="mb-2 font-semibold text-center text-gray-700">Registration with Google</div>
      <div ref={googleDivRef} className="flex justify-center mt-4" aria-label="Registration with Google"></div>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm text-center text-green-600">{message}</p>
      )}

      {/* Link to Sign In */}
      <div className="mt-4 text-center">
        <p>
          Already have an account?{' '}
          <Link href="/signup">
            <span className="font-semibold text-indigo-600 cursor-pointer">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export { SignUpForm };
