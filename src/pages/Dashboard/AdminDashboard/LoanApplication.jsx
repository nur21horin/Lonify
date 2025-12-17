import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, Loader2, Filter } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import BulkStatusUpdate from "./BulkStatusUpdate";

const statusOptions = ["All", "pending", "approved", "rejected", "canceled"];

const LoanApplicationsAdmin = () => {
  const { firebaseUser, user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedApps, setSelectedApps] = useState([]);

  const fetchApplications = async (status = "All") => {
    if (!firebaseUser) return;
    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();
      let url = "http://localhost:5000/loan-applications";
      if (status !== "All") url += `?status=${status}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch {
      Swal.fire("Error", "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleView = (app) => {
    Swal.fire({
      title: "Loan Details",
      html: `
        <p><b>Email:</b> ${app.userEmail}</p>
        <p><b>Loan:</b> ${app.loanTitle}</p>
        <p><b>Amount:</b> $${app.loanAmount}</p>
        <p><b>Status:</b> ${app.status}</p>
      `,
      icon: "info",
    });
  };

  useEffect(() => {
    fetchApplications(filterStatus);
  }, [firebaseUser, filterStatus]);

  const toggleSelect = (id) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async (status) => {
    try {
      const token = await user.getIdToken();
      await Promise.all(
        selectedApps.map((id) => {
          let endpoint = "";
          if (status === "approved") {
            endpoint = `/loan-applications/${id}/approve`;
          } else if (status === "rejected") {
            endpoint = `/loan-applications/${id}/reject`;
          } else {
            throw new Error("Invalid action");
          }
          return axios.patch(`http://localhost:5000${endpoint}`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
      );
      Swal.fire("Success", "Applications updated", "success");
      fetchApplications(filterStatus);
    } catch (err) {
      Swal.fire("Error", "Bulk update failed", "error");
    }
  };
  if (loading) {
    return (
      <div className="p-10 text-center text-black">
        <Loader2 className="animate-spin inline" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg text-black">
      <h1 className="text-2xl font-bold mb-4">Loan Applications</h1>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Filter />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-1 rounded"
        >
          {statusOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <BulkStatusUpdate
          selectedApps={selectedApps}
          onBulkUpdate={handleBulkUpdate}
        />
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Mark</th>
            <th className="p-2">Loan</th>
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="border-t">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedApps.includes(app._id)}
                  onChange={() => toggleSelect(app._id)}
                />
              </td>
              <td className="p-2">{app.loanTitle}</td>
              <td className="p-2">{app.userEmail}</td>
              <td className="p-2">${app.loanAmount}</td>
              <td className="p-2 font-semibold">{app.status}</td>
              <td className="p-2">
                <button
                  onClick={() => handleView(app)}
                  className="text-blue-600"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );//Nur
};

export default LoanApplicationsAdmin;
