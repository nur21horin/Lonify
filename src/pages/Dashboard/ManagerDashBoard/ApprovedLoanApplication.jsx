// ApprovedLoans.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Loader2 } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
const ApprovedLoans = () => {
  const { firebaseUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved applications
  const fetchApprovedApplications = async () => {
    if (!firebaseUser) return;

    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();
      const res = await axios.get(
        "https://lonify-server-side.onrender.com//loan-applications?status=approved",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching approved loans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, [firebaseUser]);

  // View loan details
  const handleViewDetails = (app) => {
    Swal.fire({
      title: "Approved Loan Details",
      html: `
        <p style="color:black;"><strong>Borrower Name:</strong> ${
          app.userName || "N/A"
        }</p>
        <p style="color:black;"><strong>Borrower Email:</strong> ${
          app.userEmail
        }</p>
        <p style="color:black;"><strong>Loan Title:</strong> ${
          app.loanTitle || "N/A"
        }</p>
        <p style="color:black;"><strong>Interest Rate:</strong> ${
          app.interestRate || "N/A"
        }%</p>
        <p style="color:black;"><strong>Amount:</strong> $${
          app.loanAmount?.toLocaleString() || "N/A"
        }</p>
        <p style="color:black;"><strong>Approved Date:</strong> ${
          app.approvedAt ? new Date(app.approvedAt).toLocaleString() : "N/A"
        }</p>
        <p style="color:black;"><strong>Description:</strong> ${
          app.description || "N/A"
        }</p>
      `,
      icon: "info",
      showCloseButton: true,
      confirmButtonText: "Close",
      width: 500,
    });
  };

  if (loading)
    return (
      <div className="text-center p-10 text-black">
        <Loader2 className="animate-spin h-6 w-6 inline" /> Loading approved
        loans...
      </div>
    );

  if (applications.length === 0)
    return (
      <div className="text-center p-10 text-black">
        No approved loan applications found.
      </div>
    );

  // inside your component
  const handleExportCSV = () => {
    if (applications.length === 0) return;

    const headers = [
      "Loan ID",
      "Borrower Name",
      "Borrower Email",
      "Loan Title",
      "Amount",
      "Interest Rate",
      "Approved Date",
    ];

    const csvRows = [
      headers.join(","), // header row
      ...applications.map((app) =>
        [
          app._id,
          app.userName || "N/A",
          app.userEmail,
          app.loanTitle || "N/A",
          app.loanAmount || "N/A",
          app.interestRate || "N/A",
          app.approvedAt ? new Date(app.approvedAt).toLocaleString() : "N/A",
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "approved_loans.csv");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-black">
          Approved Loan Applications ({applications.length})
        </h1>
        <button
          onClick={handleExportCSV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Loan ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Borrower Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Approved Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {app._id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-black">
                    {app.userName || "N/A"}
                  </div>
                  <div className="text-xs text-black">{app.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                  ${app.loanAmount?.toLocaleString() || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {app.approvedAt
                    ? new Date(app.approvedAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(app)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedLoans;
