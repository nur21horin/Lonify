// pages/Dashboard/Admin/AllLoansAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Loader2, Home, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify'; 

const AllLoansAdmin = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllLoans = async () => {
        try {
            setLoading(true);
            // Fetch all loans using the Admin API endpoint
            const response = await axios.get('http://localhost:5000/api/loans/admin');
            setLoans(response.data);
        } catch (error) {
            console.error("Error fetching all loans:", error);
            // toast.error("Failed to fetch loan list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllLoans();
    }, []);

    // Toggle 'Show on Home' status
    const handleToggleHome = async (loan) => {
        const newStatus = !loan.showOnHome;
        try {
            // Send PUT request to toggle status
            const response = await axios.put(`http://localhost:5000/api/loans/${loan._id}/home-toggle`, {
                showOnHome: newStatus
            });

            // Update local state
            setLoans(loans.map(l => l._id === loan._id ? response.data.loan : l));
            // toast.success(`Loan visibility set to: ${newStatus ? 'Show' : 'Hide'}`);

        } catch (error) {
            console.error("Error toggling visibility:", error);
            // toast.error("Failed to update visibility status.");
        }
    };

    // Delete Loan
    const handleDelete = async (loanId) => {
        const confirmation = window.confirm("WARNING: Deleting this loan will also delete all associated applications. Are you sure?");
        if (!confirmation) return;

        try {
            await axios.delete(`http://localhost:5000/api/loans/${loanId}`);
            setLoans(prevLoans => prevLoans.filter(loan => loan._id !== loanId));
            // toast.success("Loan deleted successfully.");
        } catch (error) {
            // toast.error("Failed to delete loan.");
        }
    };

    if (loading) return <div className="text-center p-10"><Loader2 className="animate-spin h-6 w-6 inline" /> Loading All Loans...</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6">All Loan Products (Admin View)</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Show on Home</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loans.map((loan) => (
                            <tr key={loan._id}>
                                <td className="px-6 py-4"><img src={loan.image} alt={loan.title} className="w-10 h-10 object-cover rounded" /></td>
                                <td className="px-6 py-4 text-sm font-medium">{loan.title}</td>
                                <td className="px-6 py-4 text-sm">{loan.interestRate}%</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{loan.createdByEmail}</td>
                                
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleToggleHome(loan)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center mx-auto transition ${loan.showOnHome 
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                            : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                    >
                                        <Home className="h-4 w-4 mr-1" />
                                        {loan.showOnHome ? 'Showing' : 'Hidden'}
                                    </button>
                                </td>
                                
                                <td className="px-6 py-4 text-center text-sm font-medium">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => navigate(`/dashboard/update-loan/${loan._id}`)} 
                                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50" 
                                            title="Edit Loan"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(loan._id)} 
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50" 
                                            title="Delete Loan"
                                        >
                                            <Trash2 className="h-5 w-5" />
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

export default AllLoansAdmin;