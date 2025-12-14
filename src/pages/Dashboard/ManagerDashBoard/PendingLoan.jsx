import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Check, X, Loader2 } from "lucide-react";
// import { toast } from 'react-toastify'; 

const PendingApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all applications that are 'Pending'
    useEffect(() => {
        const fetchPendingApplications = async () => {
            try {
                setLoading(true);
                // NOTE: Backend needs an endpoint to fetch applications filtered by status='Pending'
                const response = await axios.get('http://localhost:5000/api/applications?status=Pending');
                setApplications(response.data);
            } catch (error) {
                console.error("Error fetching pending applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingApplications();
    }, []);

    // Handle Status Change (Approve or Reject)
    const handleStatusChange = async (appId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/loan-applications/${appId}/status`, { 
                status: newStatus,
                reviewDate: new Date(),
                // Optionally send manager ID/email here
            });
            
            // Remove the application from the pending list upon successful update
            setApplications(prev => prev.filter(app => app._id !== appId));
            // toast.success(`Application ${newStatus} successfully!`);
            alert(`Application ${newStatus} successfully!`); // Placeholder
        } catch (error) {
            // toast.error(`Failed to ${newStatus.toLowerCase()} application.`);
            alert(`Failed to ${newStatus.toLowerCase()} application.`); // Placeholder
        }
    };

    // View Details Modal
    const handleViewDetails = (app) => {
        // Implement modal or redirection to a full detail page
        console.log("Viewing full details for:", app.userEmail);
        alert(`Viewing details for Loan ID: ${app._id.slice(0, 8)}... - User: ${app.userName}`);
    };

    if (loading) return <div className="text-center p-10"><Loader2 className="animate-spin h-6 w-6 inline" /> Loading Pending Applications...</div>;
    if (applications.length === 0) return <div className="text-center p-10 text-gray-500">No pending loan applications found.</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Pending Loan Applications ({applications.length})</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Submitted</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app._id.slice(0, 8)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium">{app.userName || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{app.userEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">${app.loanAmount?.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => handleViewDetails(app)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50" title="View Details">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleStatusChange(app._id, 'Approved')} className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600 transition" title="Approve Loan">
                                            <Check className="h-4 w-4" /> Approve
                                        </button>
                                        <button onClick={() => handleStatusChange(app._id, 'Rejected')} className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600 transition" title="Reject Loan">
                                            <X className="h-4 w-4" /> Reject
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

export default PendingApplications;