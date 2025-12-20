// AllLoansAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Loader2, Home } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const AllLoansAdmin = () => {
  const { firebaseUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all loans
  const fetchAllLoans = async () => {
    if (!firebaseUser) return;
    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();
      const response = await axios.get(
        "https://lonify-server-side.onrender.com/loans",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to fetch loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLoans();
  }, [firebaseUser]);

  // Toggle "Show on Home"
  const handleToggleHome = async (loan) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.patch(
        `https://lonify-server-side.onrender.com/loans/${loan._id}/show`,
        { showOnHome: !loan.showOnHome },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoans(loans.map((l) => (l._id === loan._id ? response.data : l)));
      toast.success(
        `Loan "${loan.title}" is now ${
          response.data.showOnHome ? "Showing" : "Hidden"
        } on Home`
      );
    } catch (error) {
      console.error("Error toggling home visibility:", error);
      toast.error("Failed to update visibility.");
    }
  };

  // Delete loan
  const handleDelete = async (loanId, loanTitle) => {
    const confirm = window.confirm(
      `WARNING: Deleting "${loanTitle}" will remove all associated applications. Proceed?`
    );
    if (!confirm) return;

    try {
      const token = await firebaseUser.getIdToken();
      await axios.delete(
        `https://lonify-server-side.onrender.com/loans/${loanId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoans(loans.filter((l) => l._id !== loanId));
      toast.success(`Loan "${loanTitle}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting loan:", error);
      toast.error("Failed to delete loan.");
    }
  };

  // Update loan using SweetAlert
  const handleUpdate = async (loan) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Loan",
      html:
        `<input id="swal-title" class="swal2-input" placeholder="Title" value="${loan.title}">` +
        `<input id="swal-category" class="swal2-input" placeholder="Category" value="${loan.category}">` +
        `<input id="swal-interest" type="number" class="swal2-input" placeholder="Interest Rate" value="${loan.interestRate}">` +
        `<input id="swal-minLimit" type="number" class="swal2-input" placeholder="Min Limit" value="${
          loan.minLimit || ""
        }">` +
        `<input id="swal-maxLimit" type="number" class="swal2-input" placeholder="Max Limit" value="${
          loan.maxLimit || ""
        }">` +
        `<textarea id="swal-description" class="swal2-textarea" placeholder="Description">${
          loan.description || ""
        }</textarea>` +
        `<div style="display:flex; align-items:center; margin-top:10px; gap:5px;">` +
        `<input id="swal-showOnHome" type="checkbox" ${
          loan.showOnHome ? "checked" : ""
        } />` +
        `<label for="swal-showOnHome">Show on Home</label>` +
        `</div>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value,
          category: document.getElementById("swal-category").value,
          interestRate: parseFloat(
            document.getElementById("swal-interest").value
          ),
          minLimit: parseFloat(document.getElementById("swal-minLimit").value),
          maxLimit: parseFloat(document.getElementById("swal-maxLimit").value),
          description: document.getElementById("swal-description").value,
          showOnHome: document.getElementById("swal-showOnHome").checked,
        };
      },
    });

    if (formValues) {
      try {
        const token = await firebaseUser.getIdToken();
        const res = await axios.patch(
          `https://lonify-server-side.onrender.com/loans/${loan._id}`,
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLoans((prev) =>
          prev.map((l) => (l._id === loan._id ? { ...l, ...res.data } : l))
        );
        toast.success("Loan updated successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update loan");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-10 text-black">
        <Loader2 className="animate-spin h-6 w-6 inline" /> Loading All Loans...
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-black">
        All Loan Products (Admin)
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Interest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">
                Created By
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Show on Home
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td className="px-6 py-4">
                  <img
                    src={loan.image || "https://via.placeholder.com/40"}
                    alt={loan.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 text-black">{loan.title}</td>
                <td className="px-6 py-4 text-black">{loan.interestRate}%</td>
                <td className="px-6 py-4 text-black">{loan.createdBy}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleHome(loan)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center mx-auto transition ${
                      loan.showOnHome
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    <Home className="h-4 w-4 mr-1" />
                    {loan.showOnHome ? "Showing" : "Hidden"}
                  </button>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium flex justify-center gap-2">
                  <button
                    onClick={() => handleUpdate(loan)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                    title="Edit Loan"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(loan._id, loan.title)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                    title="Delete Loan"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {/* //nur */}
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
