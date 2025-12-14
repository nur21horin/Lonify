import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // Ensure you install and import axios
import { useNavigate, useLoaderData } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";


const LoanApplicationForm = () => {
  // Data passed from the router loader (or state, depending on implementation)
  const selectedLoan = useLoaderData(); 
  
  // Auth context for user data
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // --- Guard Clause ---
  if (!user || !selectedLoan) {
    // This handles scenarios where the user is somehow not logged in on a protected route, 
    // or if the loan data fails to load.
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Error Loading Application</h2>
        <p>Please log in or select a valid loan to apply.</p>
      </div>
    );
  }

  // --- Submission Handler ---
  const onSubmit = async (data) => {
    // 1. Construct the Application Data Payload
    const loanApplication = {
      // Auto-filled (read-only)
      userId: user.uid, // Firebase User ID
      userEmail: user.email,
      loanId: selectedLoan._id, // MongoDB Loan ID
      loanTitle: selectedLoan.title,
      interestRate: selectedLoan.interestRate,

      // User Input (from form data)
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      nationalId: data.nationalId,
      incomeSource: data.incomeSource,
      monthlyIncome: parseFloat(data.monthlyIncome), // Convert to number
      loanAmount: parseFloat(data.loanAmount),       // Convert to number
      reason: data.reason,
      address: data.address,
      extraNotes: data.extraNotes || "N/A",

      // Auto-set fields (for initial status)
      status: "Pending",
      applicationFeeStatus: "Unpaid",
      createdAt: new Date().toISOString(),
    };

    // 2. API Submission
    try {
      // NOTE: Ensure your backend endpoint is correct (e.g., /api/applications)
      const response = await axios.post(
        "http://localhost:5000/api/loan-applications", 
        loanApplication
      );
      
      console.log(response.data);

      // 3. Success Feedback & Cleanup
      // Use Toast/SweetAlert here as per assignment requirement
      alert("✅ Loan application submitted successfully! Redirecting to My Loans."); 
      
      reset();
      
      // Redirect to the Borrower's tracking page
      navigate("/dashboard/my-loans"); 

    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      // Use Toast/SweetAlert here
      alert("❌ Failed to submit loan application. Please try again.");
    }
  };

  // 3. Render the Form
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
        Loan Application for: {selectedLoan.title}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* --- Auto-filled Read-Only Fields --- */}
        <div className="grid sm:grid-cols-3 gap-4 border-b pb-4 mb-4 bg-blue-50 p-4 rounded-lg">
          <InputReadOnly label="User Email" value={user.email} />
          <InputReadOnly label="Loan Title" value={selectedLoan.title} />
          <InputReadOnly label="Interest Rate (%)" value={selectedLoan.interestRate} />
        </div>

        {/* --- User Input Fields --- */}
        <h3 className="text-xl font-semibold text-gray-700">Personal Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
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

        <h3 className="text-xl font-semibold text-gray-700 mt-8">Financial & Loan Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
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
            min={selectedLoan.minLimit || 100} // Use minLimit from loan data
            max={selectedLoan.maxLimit || 10000} // Use maxLimit from loan data
          />
        </div>
        
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

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
          Submit Loan Application
        </button>
      </form>
    </div>
  );
};

export default LoanApplicationForm;

// --- Reusable Sub-Components for Cleanliness ---

const InputReadOnly = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    <input 
      value={value} 
      readOnly 
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-default" 
    />
  </div>
);

const Input = ({ label, name, register, errors, required, type = "text", ...rest }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      type={type}
      {...register(name, { required: required ? "This field is required" : false })}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      {...rest}
    />
    {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message || "Required"}</p>}
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
      {...register(name, { required: required ? "This field is required" : false })}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      {...rest}
    />
    {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message || "Required"}</p>}
  </div>
);