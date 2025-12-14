import React from "react";
import { useForm } from "react-hook-form";
// import axios from "axios";

const LoanApplicationForm = ({ user, selectedLoan }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const loanApplication = {
      // Auto-filled (read-only)
      userEmail: user.email,
      loanTitle: selectedLoan.title,
      interestRate: selectedLoan.interestRate,

      // User input
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      nationalId: data.nationalId,
      incomeSource: data.incomeSource,
      monthlyIncome: data.monthlyIncome,
      loanAmount: data.loanAmount,
      reason: data.reason,
      address: data.address,
      extraNotes: data.extraNotes,

      // Auto-set fields
      status: "Pending",
      applicationFeeStatus: "Unpaid",

      createdAt: new Date(),
    };

    try {
      await axios.post("http://localhost:5000/loan-applications", loanApplication);
      alert("Loan application submitted successfully!");
      reset();
    } catch (error) {
      console.error(error);
      alert("Failed to submit loan application");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Auto-filled Fields */}
      <div>
        <label>User Email</label>
        <input value={user.email} readOnly className="input" />
      </div>

      <div>
        <label>Loan Title</label>
        <input value={selectedLoan.title} readOnly className="input" />
      </div>

      <div>
        <label>Interest Rate (%)</label>
        <input value={selectedLoan.interestRate} readOnly className="input" />
      </div>

      {/* User Input Fields */}
      <div>
        <label>First Name</label>
        <input {...register("firstName", { required: true })} className="input" />
        {errors.firstName && <p className="error">Required</p>}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register("lastName", { required: true })} className="input" />
      </div>

      <div>
        <label>Contact Number</label>
        <input {...register("contactNumber", { required: true })} className="input" />
      </div>

      <div>
        <label>National ID / Passport</label>
        <input {...register("nationalId", { required: true })} className="input" />
      </div>

      <div>
        <label>Income Source</label>
        <input {...register("incomeSource", { required: true })} className="input" />
      </div>

      <div>
        <label>Monthly Income</label>
        <input
          type="number"
          {...register("monthlyIncome", { required: true })}
          className="input"
        />
      </div>

      <div>
        <label>Loan Amount</label>
        <input
          type="number"
          {...register("loanAmount", { required: true })}
          className="input"
        />
      </div>

      <div>
        <label>Reason for Loan</label>
        <textarea {...register("reason", { required: true })} className="input" />
      </div>

      <div>
        <label>Address</label>
        <textarea {...register("address", { required: true })} className="input" />
      </div>

      <div>
        <label>Extra Notes</label>
        <textarea {...register("extraNotes")} className="input" />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit Loan Application
      </button>
    </form>
  );
};

export default LoanApplicationForm;
