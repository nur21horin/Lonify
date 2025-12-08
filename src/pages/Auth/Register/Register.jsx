import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SOcialLogin from "../SocialLogin/SOcialLogin";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //password validation rules
  const passwordRules = {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
    validate: {
      hasUpper: (value) =>
        /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
      hasLower: (value) =>
        /[a-z]/.test(value) || "Must contain at least one lowercase letter",
    },
  };

  const RegisterSubmit = (data) => {
    setIsLoading(true);
    const fullName = `${data.firstName} ${data.lastName}`;
    createUser(data.email, data.password)
      .then(() => {
        return updateUserProfile(fullName, data.photoURL);
      })
      .then(() => {
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email already registered!");
        } else if (error.code === "auth/weak-password") {
          toast.error("Password is too weak!");
        } else {
          toast.error(error.message);
        }
      })
      .finally(() => setIsLoading(false));
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
        <form onSubmit={handleSubmit(RegisterSubmit)} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                required
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="First Name"
                className="mt-1 w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                placeholder="Last Name"
                className="mt-1 w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="email@mail.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              type="url"
              {...register("photoURL", { required: "Photo URL is required" })}
              placeholder="https://amrPhoto.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.photoURL && (
              <p className="text-red-500 text-sm">{errors.photoURL.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              {...register("role", { required: "Role is required" })}
              className="mt-1 w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select role</option>
              <option value="borrower">Borrower</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", passwordRules)}
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

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input type="checkbox" required className="mt-1" />
            <label className="text-sm text-gray-700">
              I agree to the{" "}
              <Link to="/terms" className="text-indigo-600 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-indigo-600 underline">
                Privacy Policy
              </Link>
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
          <Link to="/login" className="text-indigo-600 underline font-medium">
            Sign in
          </Link>
        </p>
        {/* Social Login */}
        <SOcialLogin></SOcialLogin>
      </motion.div>
    </div>
  );
};

export default Register;
