import { motion } from "framer-motion";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Shield,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";


const LoanDetails = () => {
  const loan = useLoaderData();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const isApplyDisabled = !user || role === "admin" || role === "manager";

  const emiPlans = loan?.availableEmiPlans || [];
  const requirements = loan?.requiredDocuments
    ? loan.requiredDocuments.split(",").map((d) => d.trim())
    : [];
  const benefits = loan?.benefits || [];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
     
      <div className="max-w-5xl mx-auto mb-6">
        <Link
          to="/loans"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Loans
        </Link>
      </div>

  
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={loan.image}
              alt={loan.title}
              className="rounded-xl shadow-md w-full h-64 object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full w-fit">
              {loan.category}
            </span>

            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {loan.title}
            </h1>

            <p className="text-gray-600 mt-4">{loan.longDescription}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                <TrendingUp className="mx-auto text-blue-600 h-6 w-6" />
                <p className="text-lg font-bold">{loan.interestRate}</p>
                <p className="text-xs text-gray-500">Interest Rate</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                <DollarSign className="mx-auto text-blue-600 h-6 w-6" />
                <p className="text-lg font-bold">{loan.maxLimit}</p>
                <p className="text-xs text-gray-500">Max Limit</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                <DollarSign className="mx-auto text-blue-600 h-6 w-6" />
                <p className="text-lg font-bold">{loan.minLimit}</p>
                <p className="text-xs text-gray-500">Min Limit</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                <Calendar className="mx-auto text-blue-600 h-6 w-6" />
                <p className="text-lg font-bold">{loan.tenure}</p>
                <p className="text-xs text-gray-500">Tenure</p>
              </div>
            </div>

           
            <div className="mt-8">
              <button
                disabled={isApplyDisabled}
                onClick={() =>
                  navigate(`/dashboard/apply-loan/${loan._id}`)
                }
                className={`w-full py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition
                ${
                  isApplyDisabled
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Apply Now <Shield className="h-5 w-5" />
              </button>

              {isApplyDisabled && (
                <p className="text-xs text-red-500 text-center mt-2">
                  Only normal users can apply.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
     
          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900">EMI Plans</span>
            </h3>
            <ul className="mt-4 space-y-2">
              {emiPlans.map((plan) => (
                <li key={plan} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500 h-4 w-4" />
                  {plan} months
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900">Requirements</span>
            </h3>
            <ul className="mt-4 space-y-2">
              {requirements.map((req) => (
                <li key={req} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500 h-4 w-4" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 shadow">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900">Benefits</span>
            </h3>
            <ul className="mt-4 space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500 h-4 w-4" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
