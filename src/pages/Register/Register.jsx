import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Registration requires backend. Connect your API.");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <span className="text-xl font-bold">L</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Loan<span className="text-indigo-600">ify</span>
            </span>
          </Link>

          <h1 className="mt-5 text-2xl font-semibold text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">
            Join Loanify and start your financial journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                required
                placeholder="John"
                className="mt-1 w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                required
                placeholder="Doe"
                className="mt-1 w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="example@mail.com"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg pr-12 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input type="checkbox" required className="mt-1" />
            <label className="text-sm text-gray-700">
              I agree to the{" "}
              <Link to="/terms" className="text-indigo-600 underline">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-indigo-600 underline">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
