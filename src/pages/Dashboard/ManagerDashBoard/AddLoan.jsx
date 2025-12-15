import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { motion } from "framer-motion";

const AddLoan = () => {
  const { user, firebaseUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size for confetti
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const loanData = {
      ...data,
      interestRate: parseFloat(data.interestRate),
      minLimit: parseFloat(data.minLimit),
      maxLimit: parseFloat(data.maxLimit),
      availableEmiPlans: data.availableEmiPlans
        .split(",")
        .map((p) => parseInt(p.trim()))
        .filter((n) => !isNaN(n)),
      createdBy: user.uid,
      createdByEmail: user.email,
      showOnHome: data.showOnHome || false,
    };

    try {
      const token = await firebaseUser.getIdToken();

      await axios.post("http://localhost:5000/loans", loanData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("New Loan Product Added Successfully!");
      reset();

      // Trigger confetti for 5 seconds
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error("Error adding loan:", error);
      toast.error("Failed to add loan product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 relative">
      {/* Confetti */}
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg border"
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Add New Loan Product
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loan Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              >
                <option value="">Select Category</option>
                <option value="Personal">Personal Loan</option>
                <option value="Housing">Housing Loan</option>
                <option value="Business">Business Loan</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Limits & Rate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                {...register("interestRate", {
                  required: "Rate is required",
                  valueAsNumber: true,
                })}
                type="number"
                step="0.01"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              />
              {errors.interestRate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.interestRate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Min Loan Limit ($)
              </label>
              <input
                {...register("minLimit", {
                  required: "Min Limit is required",
                  valueAsNumber: true,
                })}
                type="number"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              />
              {errors.minLimit && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.minLimit.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Loan Limit ($)
              </label>
              <input
                {...register("maxLimit", {
                  required: "Max Limit is required",
                  valueAsNumber: true,
                })}
                type="number"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              />
              {errors.maxLimit && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maxLimit.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* EMI Plans & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                EMI Plans (e.g., 12, 24, 36)
              </label>
              <input
                {...register("availableEmiPlans", {
                  required: "EMI Plans are required",
                })}
                type="text"
                placeholder="12, 24, 36"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              />
              {errors.availableEmiPlans && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.availableEmiPlans.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Required Documents
              </label>
              <input
                {...register("requiredDocuments")}
                type="text"
                placeholder="List docs (comma separated)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              {...register("image", { required: "Image URL is required" })}
              type="url"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Show on Home */}
          <div className="flex items-center">
            <input
              {...register("showOnHome")}
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Show this loan on the Home Page
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? "Adding Loan..." : "Add Loan Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLoan;
