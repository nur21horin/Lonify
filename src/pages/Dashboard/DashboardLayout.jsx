// pages/Dashboard/DashboardLayout.jsx
import { Outlet, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="flex flex-col gap-2">
          <Link to="/dashboard/profile" className="hover:bg-gray-700 p-2 rounded">My Profile</Link>

          {user?.role === "admin" && (
            <>
              <Link to="/dashboard/admin/manage-users" className="hover:bg-gray-700 p-2 rounded">Manage Users</Link>
              <Link to="/dashboard/admin/all-loans" className="hover:bg-gray-700 p-2 rounded">All Loans</Link>
              <Link to="/dashboard/admin/loan-applications" className="hover:bg-gray-700 p-2 rounded">Loan Applications</Link>
            </>
          )}

          {user?.role === "manager" && (
            <>
              <Link to="/dashboard/manager/add-loan" className="hover:bg-gray-700 p-2 rounded">Add Loan</Link>
              <Link to="/dashboard/manager/manage-loans" className="hover:bg-gray-700 p-2 rounded">Manage Loans</Link>
              <Link to="/dashboard/manager/pending-loans" className="hover:bg-gray-700 p-2 rounded">Pending Loans</Link>
            </>
          )}

          {user?.role === "borrower" && (
            <Link to="/dashboard/my-loans" className="hover:bg-gray-700 p-2 rounded">My Loans</Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
