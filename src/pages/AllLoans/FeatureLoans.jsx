import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const FeatureLoans = ({ featuredLoans = [], isLoading = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle button click
  const handleViewDetails = (loanId) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/loans/${loanId}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 inline-block"></div>
        <p className="mt-4 text-gray-600">Loading featured loans...</p>
      </div>
    );
  }

  // No data
  if (!featuredLoans || featuredLoans.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Loans We Think You&apos;ll Like
        </h2>
        <p className="text-center text-gray-600 mb-10">
          These new or less-frequently viewed plans might be a perfect fit.
        </p>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredLoans.map((loan) => (
            <motion.div
              key={loan.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              }}
              className="bg-white border rounded-xl shadow-lg transition"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={
                    loan.image ||
                    "https://via.placeholder.com/400x200?text=Loan+Image"
                  }
                  alt={loan.title}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  {loan.category || "Featured"}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                  {loan.title}
                </h3>

                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {loan.description}
                </p>

                <div className="flex justify-between mt-4 text-gray-800 text-sm font-semibold border-t pt-2">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    {loan.interestRate} Interest
                  </span>
                  <span>Max: {loan.maxLimit}</span>
                </div>

                <button
                  onClick={() => handleViewDetails(loan.id)}
                  className="mt-4 inline-flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureLoans;
