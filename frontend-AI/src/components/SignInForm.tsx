import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

import { useAuth } from '../context/AuthContext'; // Import the auth context
import { loginUser } from '../utils/api';
import { googleAuth } from '../utils/api';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth(); // Get the login function from context
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
        login(data.user); // Save user data in context and localStorage
        setMessage('Google login successful! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Google auth error:', err); // Debug log
      setMessage(err.message || 'Google login failed');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData); // Assuming the response contains user info
      login(user); // Save user data in context and localStorage

      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/'); // Redirect to main page
      }, 1500);
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
    }
  };

  return (
    <div className="p-8 mx-auto mt-10 max-w-md bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-indigo-600">
        Sign In
      </h2>

      <form onSubmit={handleSubmit}>
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
            value={formData.email}
            onChange={handleChange}
          />
        </div>

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

        <div className="mt-6">
          <button
            type="submit"
            className="py-3 w-full text-white bg-indigo-600 rounded-md"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Google Sign-In Button */}
      <div ref={googleDivRef} className="flex justify-center mt-4"></div>

      {message && (
        <p className="mt-4 text-sm text-center text-red-600">{message}</p>
      )}

      <div className="mt-4 text-center">
        <p>
          Don&apos;t have an account?{' '}
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

export { SignInForm };
