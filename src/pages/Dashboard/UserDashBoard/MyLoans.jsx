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
// Assuming you use SweetAlert for better UX
// import Swal from 'sweetalert2'; 

const MyLoans = () => {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Fetch Loan Applications ---
  useEffect(() => {
    if (user?.email) {
      const fetchApplications = async () => {
        try {
          setDataLoading(true);
          // NOTE: Update this URL to your production/local backend API
          const response = await axios.get(
            `http://localhost:5000/api/my-loans?email=${user.email}`
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
        // If user is null after loading is false, the user is not logged in
        setDataLoading(false);
    }
  }, [user, loading]);

  // --- 2. Action Handlers ---

  // Handle Loan Cancellation (only if Status is Pending)
  const handleCancel = async (applicationId) => {
    // Implement SweetAlert confirmation modal here
    const confirmation = window.confirm("Are you sure you want to cancel this application?");
    
    if (confirmation) {
      try {
        // NOTE: Ensure your backend handles this PUT request with authorization
        await axios.put(
          `http://localhost:5000/api/loan-applications/${applicationId}/status`,
          { status: "Canceled" }
        );
        
        // Update state locally for instant feedback
        setApplications(prev => 
            prev.map(app => 
                app._id === applicationId ? { ...app, status: "Canceled" } : app
            )
        );
        // Swal.fire("Canceled!", "Your application has been canceled.", "success");
        alert("Application canceled successfully!"); // Placeholder alert
        
      } catch (err) {
        console.error("Cancel Error:", err);
        // Swal.fire("Error", "Failed to cancel application.", "error");
        alert("Failed to cancel application."); // Placeholder alert
      }
    }
  };

  // Handle Payment (Challenge Point 5: Stripe Integration)
  const handlePay = async (applicationId) => {
    try {
      // 1. Call Backend to Create Stripe Checkout Session
      const { data } = await axios.post(
        "http://localhost:5000/api/create-payment-session",
        { 
          loanApplicationId: applicationId, 
          amount: 1000 // $10.00 in cents
        }
      );

      // 2. Redirect User to Stripe
      window.location.href = data.url;
      
    } catch (err) {
      console.error("Payment Error:", err);
      // Swal.fire("Error", "Could not initiate payment. Try again.", "error");
      alert("Could not initiate payment. Try again."); // Placeholder alert
    }
  };
  
  // Handle Paid Status Click (Challenge Point 5: Display Payment Details)
  const handleViewPaymentDetails = (paymentDetails) => {
      // Use a custom modal or SweetAlert to display the transaction info
      // e.g., Swal.fire({ title: 'Payment Details', html: `...` });
      alert(`Payment Details:\nTransaction ID: ${paymentDetails.transactionId}\nPaid Amount: $10.00\nDate: ${new Date(paymentDetails.paidAt).toLocaleDateString()}`);
  }

  // --- 3. Loading and Error States ---
  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-700">Loading applications...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-600 font-medium">{error}</div>;
  }
  
  if (applications.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">No Loan Applications Found</h2>
        <p className="mt-2 text-gray-600">Start exploring loans to submit your first application!</p>
        <Link to="/loans" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Explore Loans
        </Link>
      </div>
    );
  }

  // --- 4. Render Table ---
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Loan Applications</h1>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Fee</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <div className="text-sm font-medium text-blue-600">{app.loanTitle}</div>
                  <div className="text-xs text-gray-500">{app.category}</div>
                </td>
                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${app.loanAmount?.toLocaleString() || 'N/A'}
                </td>
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === "Approved" ? "bg-green-100 text-green-800" :
                      app.status === "Rejected" || app.status === "Canceled" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                  }`}>
                    {app.status}
                  </span>
                </td>
                {/* Application Fee Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                    {app.applicationFeeStatus === "Paid" ? (
                        <button 
                            onClick={() => handleViewPaymentDetails(app.paymentDetails)}
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
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex gap-2 justify-center">
                    {/* View Button */}
                    <button 
                        // You will need a modal or separate route for full details
                        // onClick={() => handleView(app)} 
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition"
                        title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    {/* Pay Button (Visible only if Unpaid) */}
                    {app.applicationFeeStatus === "Unpaid" && app.status !== "Rejected" && (
                        <button 
                            onClick={() => handlePay(app._id)}
                            className="bg-green-500 text-white hover:bg-green-600 p-2 rounded-full transition shadow-md flex items-center gap-1"
                            title="Pay Application Fee ($10)"
                        >
                          <CreditCard className="h-5 w-5" />
                        </button>
                    )}
                    
                    {/* Cancel Button (Visible only if Pending) */}
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