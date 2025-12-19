import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  XCircle,
  CheckCircle,
  Eye,
  CreditCard,
  Ban,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const MyLoans = () => {
  const { user, loading, firebaseUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email && firebaseUser) {
      const fetchApplications = async () => {
        try {
          setDataLoading(true);

          const token = await firebaseUser.getIdToken();

          const response = await axios.get(
            `https://lonify-server-side.onrender.com//loan-applications/my-applications`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setApplications(response.data);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch applications:", err);
          setError("Failed to load your loan applications.");
        } finally {
          setDataLoading(false);
        }
      };
      fetchApplications();
    } else if (!loading) {
      setDataLoading(false);
    }
  }, [user, loading, firebaseUser]);

  const handleCancel = async (applicationId) => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (confirmation) {
      try {
        await axios.put(
          `https://lonify-server-side.onrender.com//api/loan-applications/${applicationId}/status`,
          { status: "Canceled" }
        );

        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: "Canceled" } : app
          )
        );

        alert("Application canceled successfully!");
      } catch (err) {
        console.error("Cancel Error:", err);

        alert("Failed to cancel application.");
      }
    }
  };

  const handlePay = async (applicationId) => {
    try {
      const { data } = await axios.post(
        "https://lonify-server-side.onrender.com//api/create-payment-session",
        {
          loanApplicationId: applicationId,
          amount: 1000, // $10.00 in cents
        }
      );

      window.location.href = data.url;
    } catch (err) {
      console.error("Payment Error:", err);

      alert("Could not initiate payment. Try again.");
    }
  };

  const handleViewPaymentDetails = (paymentDetails) => {
    alert(
      `Payment Details:\nTransaction ID: ${
        paymentDetails.transactionId
      }\nPaid Amount: $10.00\nDate: ${new Date(
        paymentDetails.paidAt
      ).toLocaleDateString()}`
    );
  };

  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-700">
          Loading applications...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-medium">{error}</div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">
          No Loan Applications Found
        </h2>
        <p className="mt-2 text-gray-600">
          Start exploring loans to submit your first application!
        </p>
        <Link
          to="/loans"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Explore Loans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        My Loan Applications
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application Fee
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id}>
                {/* Loan ID */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {app._id.slice(0, 8)}...
                </td>
                {/* Loan Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">
                    {app.loanTitle}
                  </div>
                  <div className="text-xs text-gray-500">{app.category}</div>
                </td>
                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${app.loanAmount?.toLocaleString() || "N/A"}
                </td>
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : app.status === "Rejected" || app.status === "Canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {app.applicationFeeStatus === "Paid" ? (
                    <button
                      onClick={() =>
                        handleViewPaymentDetails(app.paymentDetails)
                      }
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white flex items-center gap-1 hover:bg-green-600 transition"
                    >
                      <CheckCircle className="h-3 w-3" /> Paid
                    </button>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      Unpaid
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>

                    {app.applicationFeeStatus === "Unpaid" &&
                      app.status !== "Rejected" && (
                        <button
                          onClick={() => handlePay(app._id)}
                          className="bg-green-500 text-white hover:bg-green-600 p-2 rounded-full transition shadow-md flex items-center gap-1"
                          title="Pay Application Fee ($10)"
                        >
                          <CreditCard className="h-5 w-5" />
                        </button>
                      )}

                    {app.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(app._id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition"
                        title="Cancel Application"
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLoans;
