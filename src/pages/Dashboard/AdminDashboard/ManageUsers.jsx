// pages/Dashboard/Admin/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserCheck, UserX, Loader2, Edit, Save } from "lucide-react";
// import { toast } from 'react-toastify'; 

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null); // Stores the UID of the user currently being edited
    const [newRole, setNewRole] = useState("");
    const [isSuspended, setIsSuspended] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Fetch all non-admin users using the new API endpoint
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            // toast.error("Failed to fetch user list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to start editing a user
    const startEditing = (user) => {
        setEditingUser(user.uid);
        setNewRole(user.role);
        setIsSuspended(user.isSuspended);
    };

    // Function to save the updated role/status
    const handleUpdateUser = async (uid) => {
        if (!newRole) {
            // toast.error("Role cannot be empty.");
            return;
        }

        try {
            // Send PUT request to update the user using the new API endpoint
            const response = await axios.put(`http://localhost:5000/api/users/${uid}/status`, {
                role: newRole,
                isSuspended: isSuspended,
            });
            
            // Update the local state with the new data
            setUsers(users.map(u => u.uid === uid ? response.data.user : u));
            setEditingUser(null);
            // toast.success(`${response.data.user.name}'s profile updated.`);

        } catch (error) {
            console.error("Error updating user:", error);
            // toast.error("Failed to update user profile.");
        }
    };
    
    // Function to toggle suspension status immediately (without needing 'Save')
    const toggleSuspension = async (user) => {
        const confirmToggle = window.confirm(`Are you sure you want to ${user.isSuspended ? 'UNSUSPEND' : 'SUSPEND'} ${user.name}?`);
        if (!confirmToggle) return;
        
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${user.uid}/status`, {
                isSuspended: !user.isSuspended,
            });
            
            // Update the local state
            setUsers(users.map(u => u.uid === user.uid ? response.data.user : u));
            // toast.success(`User ${user.isSuspended ? 'Unsuspended' : 'Suspended'} successfully.`);

        } catch (error) {
            // toast.error("Failed to toggle suspension status.");
        }
    };

    if (loading) return <div className="text-center p-10"><Loader2 className="animate-spin h-6 w-6 inline" /> Loading Users...</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.uid} className={user.isSuspended ? 'bg-red-50' : ''}>
                                <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                                <td className="px-6 py-4 text-sm">{user.email}</td>
                                
                                <td className="px-6 py-4 text-sm">
                                    {editingUser === user.uid ? (
                                        <select 
                                            value={newRole} 
                                            onChange={(e) => setNewRole(e.target.value)}
                                            className="border rounded p-1 text-sm"
                                        >
                                            <option value="borrower">Borrower</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                              user.role === 'manager' ? 'bg-indigo-100 text-indigo-800' :
                                              'bg-gray-100 text-gray-800'}`}
                                        >
                                            {user.role}
                                        </span>
                                    )}
                                </td>
                                
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isSuspended ? 'bg-red-200 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.isSuspended ? 'Suspended' : 'Active'}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-center text-sm font-medium">
                                    <div className="flex justify-center gap-2">
                                        {editingUser === user.uid ? (
                                            <button 
                                                onClick={() => handleUpdateUser(user.uid)} 
                                                className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                                                title="Save Changes"
                                            >
                                                <Save className="h-5 w-5" />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => startEditing(user)} 
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                                                title="Edit Role"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                        )}
                                        
                                        <button 
                                            onClick={() => toggleSuspension(user)} 
                                            className={`p-2 rounded-full transition ${user.isSuspended 
                                                ? 'text-green-600 hover:text-green-900 hover:bg-green-50' 
                                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'}`}
                                            title={user.isSuspended ? "Unsuspend User" : "Suspend User"}
                                        >
                                            {user.isSuspended ? <UserCheck className="h-5 w-5" /> : <UserX className="h-5 w-5" />}
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

export default ManageUsers;