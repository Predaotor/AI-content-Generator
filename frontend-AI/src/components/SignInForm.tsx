import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '../utils/api';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      setMessage('Login successful!');
      console.log(res); // Optionally save token and redirect
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-indigo-600">Sign In</h2>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email (or leave blank if using username)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="mt-2 w-full rounded-md border border-gray-300 p-3"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Username */}
        <div className="mt-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username (or leave blank if using email)
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            className="mt-2 w-full rounded-md border border-gray-300 p-3"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded-md border border-gray-300 p-3"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button type="submit" className="w-full rounded-md bg-indigo-600 py-3 text-white">
            Sign In
          </button>
        </div>
      </form>

      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}

      {/* Link to signup */}
      <div className="mt-4 text-center">
        <p>Don&apos;t have an account?{' '}
          <Link href="/signup">
            <span className="cursor-pointer font-semibold text-indigo-600">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export { SignInForm };
