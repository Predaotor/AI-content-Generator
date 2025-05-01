import Link from 'next/link';

const SignUpForm = () => {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-indigo-600">
        Sign Up
      </h2>

      <form>
        {/* Full Name Input */}
        <div className="mt-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-md border border-gray-300 p-3"
            required
          />
        </div>

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
            Sign Up
          </button>
        </div>
      </form>

      {/* Link to Sign In page */}
      <div className="mt-4 text-center">
        <p>Already have an account?</p>
        <Link href="/signin">
          <span className="cursor-pointer font-semibold text-indigo-600">
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
};

export { SignUpForm };
