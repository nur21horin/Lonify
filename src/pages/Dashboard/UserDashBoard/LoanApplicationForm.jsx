import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; 

// =========================================================================
// 1. REUSABLE SUB-COMPONENTS
// =========================================================================

const InputReadOnly = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    <input
      value={value}
      readOnly
      className="mt-1 block w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-default"
    />
  </div>
);

const Input = ({
  label,
  name,
  register,
  errors,
  required,
  type = "text",
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      type={type}
      {...register(name, {
        required: required ? "This field is required" : false,
      })}
      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black" 
      {...rest}
    />
    {errors[name] && (
      <p className="mt-1 text-xs text-red-600">
        {errors[name].message || "Required"}
      </p>
    )}
  </div>
);

const Textarea = ({ label, name, register, errors, required, ...rest }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      rows="3"
      {...register(name, {
        required: required ? "This field is required" : false,
      })}
      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
      {...rest}
    />
    {errors[name] && (
      <p className="mt-1 text-xs text-red-600">
        {errors[name].message || "Required"}
      </p>
    )}
  </div>
);

// =========================================================================
// 2. MAIN COMPONENT: LoanApplicationForm
// =========================================================================

const LoanApplicationForm = () => {
  const selectedLoan = useLoaderData();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure(); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    
    if (!user || !selectedLoan) {
      Swal.fire({
        title: "Error!",
        text: "User or loan data is missing. Cannot submit.",
        icon: "error",
      });
      return;
    }
    
    const loanApplication = {
      userId: user.uid,
      userEmail: user.email,
      loanId: selectedLoan._id, 
      loanTitle: selectedLoan.title,
      interestRate: parseFloat(selectedLoan.interestRate), 

      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      nationalId: data.nationalId,
      incomeSource: data.incomeSource,
      monthlyIncome: parseFloat(data.monthlyIncome),
      loanAmount: parseFloat(data.loanAmount),
      reason: data.reason,
      address: data.address,
      extraNotes: data.extraNotes || "N/A",

      status: "pending", 
      applicationFeeStatus: "unpaid", 
    };

    try {
      const response = await axiosSecure.post(
        "/loan-applications", 
        loanApplication
      );

      Swal.fire({
        title: "Application Sent!",
        text: "Your loan application has been submitted successfully.",
        icon: "success",
        confirmButtonText: "Go to My Loans",
      });
        
      reset();

      navigate("/dashboard/my-loans");
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to submit application. Please check network connection and try again.",
        icon: "error",
      });
    }
  };

  if (!user || !selectedLoan) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center py-20 bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600">Authentication Required</h2>
        <p className="text-gray-600">Please ensure you are logged in and selected a valid loan.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center text-black bg-gray-50 px-4 py-12"> 
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl border"> 
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3 text-center">
          Loan Application
        </h2>
        <p className="text-center text-gray-600 mb-8">
            Applying for: <span className="font-semibold text-indigo-600">{selectedLoan.title}</span> 
            <span className="text-sm ml-2"> (Interest Rate: {selectedLoan.interestRate}%)</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <h3 className="text-xl font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3">
            Loan Overview
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 bg-indigo-50/50 p-4 rounded-lg border border-indigo-200">
            <InputReadOnly label="User Email" value={user.email} />
            <InputReadOnly label="Loan Title" value={selectedLoan.title} />
            <InputReadOnly
              label="Interest Rate (%)"
              value={selectedLoan.interestRate}
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3 pt-4">
            Personal Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="First Name"
              name="firstName"
              register={register}
              errors={errors}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              register={register}
              errors={errors}
              required
            />
            <Input
              label="Contact Number"
              name="contactNumber"
              register={register}
              errors={errors}
              required
              type="tel"
            />
            <Input
              label="National ID / Passport"
              name="nationalId"
              register={register}
              errors={errors}
              required
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3 pt-4">
            Financial & Loan Details
          </h3>
          <div className="grid sm:grid-cols-3 gap-5">
            <Input
              label="Income Source"
              name="incomeSource"
              register={register}
              errors={errors}
              required
            />
            <Input
              label="Monthly Income ($)"
              name="monthlyIncome"
              register={register}
              errors={errors}
              required
              type="number"
              min={0}
            />
            <Input
              label="Requested Loan Amount ($)"
              name="loanAmount"
              register={register}
              errors={errors}
              required
              type="number"
              min={selectedLoan.minLimit || 100}
              max={selectedLoan.maxLimit || 10000}
            />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3 pt-4">
            Purpose & Location
          </h3>
          <div className="grid sm:grid-cols-1 gap-5">
            <Textarea
              label="Full Address"
              name="address"
              register={register}
              errors={errors}
              required
            />
            <Textarea
              label="Reason for Loan"
              name="reason"
              register={register}
              errors={errors}
              required
            />
            <Textarea
              label="Extra Notes (Optional)"
              name="extraNotes"
              register={register}
              errors={errors}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            Submit Loan Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationForm;