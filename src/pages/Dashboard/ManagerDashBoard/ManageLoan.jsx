import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Trash2, Loader2, Search } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const ManageLoans = () => {
  const { firebaseUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch loans
  useEffect(() => {
    const fetchLoans = async () => {
      if (!firebaseUser) return;
      setLoading(true);
      try {
        const token = await firebaseUser.getIdToken();
        const res = await axios.get(
          "https://lonify-server-side.onrender.com/loans",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLoans(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [firebaseUser]);

  // Delete loan
  const handleDelete = async (loanId) => {
    if (!firebaseUser) return;
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the loan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = await firebaseUser.getIdToken();
        await axios.delete(
          `https://lonify-server-side.onrender.com/loans/${loanId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLoans((prev) => prev.filter((loan) => loan._id !== loanId));
        Swal.fire("Deleted!", "Loan has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete loan.", "error");
      }
    }
  };

 
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
        await axios.patch(
          `https://lonify-server-side.onrender.com/loans/${loan._id}`,
          formValues,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLoans((prev) =>
          prev.map((l) => (l._id === loan._id ? { ...l, ...formValues } : l))
        );
        toast.success("Loan updated successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update loan");
      }
    }
  };

  // Filter loans
  const filteredLoans = loans.filter(
    (loan) =>
      loan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-black">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading loans...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="p-6 rounded-xl bg-black text-white text-3xl font-bold shadow-md">
        Manage Your Loan Products
      </div>

      {/* Search */}
      <div className="flex items-center mb-6 max-w-md border border-gray-300 rounded-lg overflow-hidden">
        <Search className="h-5 w-5 ml-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Title or Category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-white text-black focus:outline-none"
        />
      </div>

      {filteredLoans.length === 0 ? (
        <p className="text-black">No loans found.</p>
      ) : (
        <AnimatePresence>
          {filteredLoans.map((loan) => (
            <motion.div
              key={loan._id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white text-black border border-gray-200 rounded-xl p-6 shadow-md space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Title: {loan.title}</p>
                </div>
                <div>
                  <p className="font-medium">Category: {loan.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>Interest Rate: {loan.interestRate}%</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={loan.showOnHome} readOnly />
                  <span>Show on Home</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => handleUpdate(loan)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <Edit3 size={16} /> Update
                </button>
                <button
                  onClick={() => handleDelete(loan._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ManageLoans;
