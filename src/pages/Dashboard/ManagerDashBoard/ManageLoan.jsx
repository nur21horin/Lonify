import React, { useState, useEffect } from "react";
import axios from "axios";

import { Edit3, Trash2, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";


const ManageLoans = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch loans created by the current manager
    useEffect(() => {
        const fetchLoans = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                // NOTE: Backend needs an endpoint to fetch loans filtered by 'createdByEmail'
                const response = await axios.get(`http://localhost:5000/api/loans/manager/${user.email}`);
                setLoans(response.data);
            } catch (error) {
                console.error("Error fetching manager loans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, [user]);

    // Delete Loan
    const handleDelete = async (loanId) => {
        const confirmation = window.confirm("Are you sure you want to permanently delete this loan?");
        if (confirmation) {
            try {
                await axios.delete(`http://localhost:5000/api/loans/${loanId}`);
                setLoans(prevLoans => prevLoans.filter(loan => loan._id !== loanId));
                // toast.success("Loan deleted.");
            } catch (error) {
                // toast.error("Failed to delete loan.");
            }
        }
    };

    // Update Loan (Redirect to an edit page)
    const handleUpdate = (loanId) => {
        navigate(`/dashboard/update-loan/${loanId}`);
    };

    // Filter logic (Client-side filtering by title or category)
    const filteredLoans = loans.filter(loan => 
        loan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        loan.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-10"><Loader2 className="animate-spin h-6 w-6 inline" /> Loading Loans...</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Manage Your Loan Products</h1>
            
            {/* Search/Filter Bar */}
            <div className="mb-6 flex items-center border border-gray-300 rounded-lg overflow-hidden max-w-sm">
                <Search className="h-5 w-5 ml-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Title or Category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 focus:ring-0 focus:outline-none"
                />
            </div>
            
            {/* Loans Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLoans.length > 0 ? (
                            filteredLoans.map((loan) => (
                                <tr key={loan._id}>
                                    <td className="px-6 py-4"><img src={loan.image} alt={loan.title} className="w-10 h-10 object-cover rounded" /></td>
                                    <td className="px-6 py-4 text-sm font-medium">{loan.title}</td>
                                    <td className="px-6 py-4 text-sm">{loan.interestRate}%</td>
                                    <td className="px-6 py-4 text-sm">{loan.category}</td>
                                    <td className="px-6 py-4 text-center text-sm font-medium">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleUpdate(loan._id)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50" title="Edit Loan">
                                                <Edit3 className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDelete(loan._id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50" title="Delete Loan">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No loans found or created by you.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageLoans;