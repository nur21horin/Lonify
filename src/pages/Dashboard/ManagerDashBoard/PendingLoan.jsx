// PendingLoans.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
const PendingLoans = () => {
  const { user, loading, firebaseUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingApplications = async () => {
    if (!user?.email || !firebaseUser || user.role !== "manager") {
      setError("Access Denied or Not Logged In as Manager.");
      setDataLoading(false);
      return;
    }

    try {
      setDataLoading(true);
      const token = await firebaseUser.getIdToken();

      const response = await axios.get(
        `http://localhost:5000/loan-applications?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(response.data);
      setError(null);
    } catch (err) {
      console.error(
        "Failed to fetch pending applications:",
        err.response?.data || err.message
      );
      setError(
        "Failed to load pending applications. Check network or permissions."
      );
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingApplications();
  }, [user, loading, firebaseUser]);

  const handleStatusUpdate = async (applicationId, action) => {
    if (!firebaseUser) return alert("Authentication required.");

    const confirmation = window.confirm(
      `Are you sure you want to ${action} application ${applicationId.slice(
        0,
        8
      )}...?`
    );
    if (confirmation) {
      try {
        const token = await firebaseUser.getIdToken();
        const endpoint = `/loan-applications/${applicationId}/${action}`;
        await axios.patch(
          `http://localhost:5000${endpoint}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications((prev) =>
          prev.filter((app) => app._id !== applicationId)
        );
        alert(`Application successfully ${action}d!`);
      } catch (err) {
        console.error(`${action} Error:`, err.response?.data || err.message);
        alert(
          `Failed to ${action} application. Error: ${
            err.response?.data?.message || "Server error"
          }`
        );
      }
    }
  };

  const handleApprove = (id) => handleStatusUpdate(id, "approve");
  const handleReject = (id) => handleStatusUpdate(id, "reject");
  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />{" "}
        <span className="ml-3 text-lg text-gray-700">
          Loading pending applications...
        </span>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-medium text-xl">
        {error}
      </div>
    );
  }
  if (applications.length === 0) {
    return (
      <div className="text-center py-20">
        {" "}
        <h2 className="text-2xl font-bold text-gray-800">
          No Pending Loans!
        </h2>{" "}
        <p className="mt-2 text-gray-600">
          All applications have been reviewed.
        </p>{" "}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
           {" "}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-2">
        Pending Loan Applications ({applications.length})
      </h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan Info
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Applied
              </th>

              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {app.applicationId || app._id.slice(0, 8) + "..."}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {app.userEmail}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-indigo-600">
                    {app.loanTitle}
                  </div>
                  <div className="text-xs text-gray-500">
                    Rate: {app.interestRate}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                  ${app.loanAmount?.toLocaleString() || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition"
                      title="View Full Application Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleApprove(app._id)}
                      className="bg-green-500 text-white hover:bg-green-600 p-2 rounded-full transition shadow-md"
                      title="Approve Loan"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReject(app._id)}
                      className="bg-red-500 text-white hover:bg-red-600 p-2 rounded-full transition shadow-md"
                      title="Reject Loan"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
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

export default PendingLoans;
