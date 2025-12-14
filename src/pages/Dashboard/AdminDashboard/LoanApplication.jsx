// pages/Dashboard/Admin/LoanApplicationsAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Filter, Loader2 } from "lucide-react";

const statusOptions = ['All', 'Pending', 'Approved', 'Rejected', 'Canceled'];

const LoanApplicationsAdmin = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchApplications = async (status = 'All') => {
        try {
            setLoading(true);
            let url = 'http://localhost:5000/api/loan-applications';
            if (status !== 'All') {
                url += `?status=${status}`; // Use the API filter endpoint
            }
            
            const response = await axios.get(url);
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            // toast.error("Failed to fetch applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications(filterStatus);
    }, [filterStatus]); // Re-fetch when filterStatus changes

    // View Details Modal/Handler
    const handleViewDetails = (app) => {
        // Implement a robust modal here to show all fields:
        // firstName, lastName, contactNumber, nationalId, incomeSource, monthlyIncome, reason, address, extraNotes, etc.
        alert(`Loan Application Details for ID: ${app._id.slice(0, 8)}...\n\nUser Email: ${app.userEmail}\nLoan Title: ${app.loanTitle}\nAmount: $${app.loanAmount.toLocaleString()}`);
    };
    
    // Status Badge Styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Canceled': return 'bg-yellow-100 text-yellow-800';
            case 'Pending':
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    if (loading) return <div className="text-center p-10"><Loader2 className="animate-spin h-6 w-6 inline" /> Loading Loan Applications...</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6">All Loan Applications (Admin View)</h1>

            {/* Filter Section */}
            <div className="mb-6 flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <span className="text-gray-500 text-sm">Total: {applications.length}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User (Name/Email)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td className="px-6 py-4 text-sm font-medium">{app._id.slice(0, 8)}...</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="font-medium">{app.userName || 'N/A'}</div> 
                                    <div className="text-gray-500 text-xs">{app.userEmail}</div>
                                </td>
                                <td className="px-6 py-4 text-sm">{app.loanTitle || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm font-semibold">${app.loanAmount?.toLocaleString()}</td>
                                
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-center text-sm font-medium">
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

export default LoanApplicationsAdmin;