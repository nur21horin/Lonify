import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Loader2 } from "lucide-react";

const ApprovedApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all applications that are 'Approved'
    useEffect(() => {
        const fetchApprovedApplications = async () => {
            try {
                setLoading(true);
                // NOTE: Backend needs an endpoint to fetch applications filtered by status='Approved'
                const response = await axios.get('http://localhost:5000/api/applications?status=Approved');
                setApplications(response.data);
            } catch (error) {
                console.error("Error fetching approved applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApprovedApplications();
    }, []);

    const handleViewDetails = (app) => {
        // Implement modal or redirection to a full detail page
        console.log("Viewing full details for approved application:", app.userEmail);
        alert(`Viewing Approved Loan Details: ${app._id.slice(0, 8)}...`);
    };

    if (loading) return <div className="text-center p-10"><Loader2 className="animate-spin h-6 w-6 inline" /> Loading Approved Applications...</div>;
    if (applications.length === 0) return <div className="text-center p-10 text-gray-500">No approved loan applications found.</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Approved Loan Applications ({applications.length})</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {app.reviewDate ? new Date(app.reviewDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button onClick={() => handleViewDetails(app)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50" title="View Details">
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

export default ApprovedApplications;