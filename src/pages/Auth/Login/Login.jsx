import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import SOcialLogin from "../SocialLogin/SOcialLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInuser, signInGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    signInuser(data.email, data.password)
      .then(() => {
        navigate(location?.state || "/");
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="flex min-h-screen items-center justify-center text-black bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <span className="text-xl font-bold">L</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Loan<span className="text-indigo-600">ify</span>
            </span>
          </Link>

          <h1 className="mt-5 text-2xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Login to continue to your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { require: true })}
              placeholder="your email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          {errors.email?.type === "required" && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true, minLength: 6 })}
                className="mt-1 w-full px-4 py-2 border rounded-lg pr-16 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 text-sm">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 text-sm">
                  Password must be at least 6 characters
                </p>
              )}

              {/* Toggle Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600  mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="text-indigo-600 underline font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
        <SOcialLogin></SOcialLogin>
      </motion.div>
    </div>
  );
};

export default Login;
