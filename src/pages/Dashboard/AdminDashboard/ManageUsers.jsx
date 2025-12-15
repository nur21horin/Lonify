import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserCheck,
  UserX,
  Loader2,
  Edit,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { firebaseUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");

  const fetchUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();
      const response = await axios.get(
        `http://localhost:5000/users?page=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / 6));
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firebaseUser) fetchUsers();
  }, [firebaseUser]);

  const startEditing = (user) => {
    setEditingUser(user.email);
    setNewRole(user.role);
  };

  const handleUpdateUser = async (email) => {
    if (!newRole) {
      toast.error("Role cannot be empty");
      return;
    }
    try {
      const token = await firebaseUser.getIdToken();
      await axios.patch(
        `http://localhost:5000/users/${email}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update
      setUsers(
        users.map((u) => (u.email === email ? { ...u, role: newRole } : u))
      );
      setEditingUser(null);
      toast.success(`User ${email} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const toggleSuspension = async (user) => {
    const confirmResult = await Swal.fire({
      title: `${user.isSuspended ? "Unsuspend" : "Suspend"} User`,
      text: `Are you sure you want to ${
        user.isSuspended ? "unsuspend" : "suspend"
      } ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: user.isSuspended ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: user.isSuspended ? "Yes, Unsuspend" : "Yes, Suspend",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const token = await firebaseUser.getIdToken();
      await axios.patch(
        `http://localhost:5000/users/${user.email}/suspend`,
        { reason: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // toggle isSuspended
      setUsers(
        users.map((u) =>
          u.email === user.email ? { ...u, isSuspended: !u.isSuspended } : u
        )
      );

      toast.success(
        `User ${user.name} ${
          !user.isSuspended ? "suspended" : "unsuspended"
        } successfully`
      );
    } catch (error) {
      console.error("Error toggling suspension:", error);
      toast.error("Failed to update user status");
    }
  };

  const handlePageJump = () => {
    const pageNumber = Number(pageInput);
    if (!pageNumber || pageNumber < 1 || pageNumber > totalPages) {
      toast.error(
        `Please enter a valid page number between 1 and ${totalPages}`
      );
      return;
    }
    fetchUsers(pageNumber);
    setPageInput("");
  };

  if (loading)
    return (
      <div className="text-center p-10 text-black">
        <Loader2 className="animate-spin h-6 w-6 inline" /> Loading Users...
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-black">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.email}
                className={user.isSuspended ? "bg-red-50" : ""}
              >
                <td className="px-6 py-4 text-sm font-medium text-black">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-black">{user.email}</td>
                <td className="px-6 py-4 text-sm text-black">
                  {editingUser === user.email ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="border rounded p-1 text-sm"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "manager"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-black">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isSuspended
                        ? "bg-red-200 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium">
                  <div className="flex justify-center gap-2">
                    {editingUser === user.email ? (
                      <button
                        onClick={() => handleUpdateUser(user.email)}
                        className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(user)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleSuspension(user)}
                      className={`p-2 rounded-full transition ${
                        user.isSuspended
                          ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                          : "text-red-600 hover:text-red-900 hover:bg-red-50"
                      }`}
                    >
                      {user.isSuspended ? (
                        <UserCheck className="h-5 w-5" />
                      ) : (
                        <UserX className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          disabled={page <= 1}
          onClick={() => fetchUsers(page - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <ChevronLeft className="inline mr-1" /> Prev
        </button>
        <span className="text-black">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => fetchUsers(page + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next <ChevronRight className="inline ml-1" />
        </button>
        <div className="flex items-center gap-2 ml-4">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder="Page #"
            className="w-20 px-2 py-1 text-black border rounded text-sm"
          />
          <button
            onClick={handlePageJump}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
