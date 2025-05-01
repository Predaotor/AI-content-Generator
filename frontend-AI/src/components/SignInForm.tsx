import Link from 'next/link';

const SignInForm = () => {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-indigo-600">
        Sign In
      </h2>

      <form>
        {/* Email Input */}
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
            className="mt-2 w-full rounded-md border border-gray-300 p-3"
            required
          />
        </div>

        {/* Password Input */}
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
            className="mt-2 w-full rounded-md border border-gray-300 p-3"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-3 text-white"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Link to Sign Up page */}
      <div className="mt-4 text-center">
        <p>Don&apos;t have an account? </p>
        <Link href="/signup">
          <span className="cursor-pointer font-semibold text-indigo-600">
            Sign Up
          </span>
        </Link>
      </div>
    </div>
  );
};

export { SignInForm };
