import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateLoan = () => {
  const loanToUpdate = useLoaderData();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: loanToUpdate.title || "",
      description: loanToUpdate.description || "",
      category: loanToUpdate.category || "",
      interestRate: loanToUpdate.interestRate || 0,
      minLimit: loanToUpdate.minLimit || 0,
      maxLimit: loanToUpdate.maxLimit || 0,

      availableEmiPlans: Array.isArray(loanToUpdate.availableEmiPlans)
        ? loanToUpdate.availableEmiPlans.join(", ")
        : "",
      requiredDocuments: loanToUpdate.requiredDocuments || "",
      image: loanToUpdate.image || "",
      showOnHome: loanToUpdate.showOnHome || false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loanId = loanToUpdate._id;

    const updatedLoanData = {
      ...data,
      interestRate: parseFloat(data.interestRate),
      minLimit: parseFloat(data.minLimit),
      maxLimit: parseFloat(data.maxLimit),

      availableEmiPlans: data.availableEmiPlans
        .split(",")
        .map((p) => parseInt(p.trim()))
        .filter((n) => !isNaN(n)),
    };

    try {
      await axios.put(
        `https://lonify-server-side.onrender.com/loans/${loanId}`,
        updatedLoanData
      );

      toast.success("Loan Product Updated Successfully!");
      alert("Loan Product Updated Successfully!");

      navigate("/dashboard/manage-loans");
    } catch (error) {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan product.");
      alert("Failed to update loan product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Update Loan Product: {loanToUpdate.title}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loan Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.maxLimit && (
              <p className="text-red-500 text-xs mt-1">
                {errors.maxLimit.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            {...register("image", { required: "Image URL is required" })}
            type="url"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
          )}
        </div>

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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? "Saving Changes..." : "Update Loan Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateLoan;
