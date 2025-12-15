import { Outlet, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function DashboardLayout() {
  const { user } = useAuth();

  const activeClass = "bg-gray-700 p-2 rounded";
  const inactiveClass = "hover:bg-gray-700 p-2 rounded";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="flex flex-col gap-2">
          {/* Common for all users */}
          <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            My Profile
          </NavLink>

          {/* Borrower */}
          {user?.role === "borrower" && (
            <>
              <NavLink to="/dashboard/my-loans" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                My Loans
              </NavLink>
              {/* <NavLink to="/apply-loan/:id" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Apply Loan
              </NavLink> */}
            </>
          )}

          {/* Manager */}
          {user?.role === "manager" && (
            <>
              <NavLink to="/dashboard/addLoan" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Add Loan
              </NavLink>
              <NavLink to="/dashboard/manageLoan" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Manage Loans
              </NavLink>
              <NavLink to="/dashboard/pendingApplication" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Pending Applications
              </NavLink>
              <NavLink to="/dashboard/approvedLoans" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Approved Applications
              </NavLink>
            </>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <NavLink to="/dashboard/manageUsers" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Manage Users
              </NavLink>
              <NavLink to="/dashboard/allLoans" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                All Loans
              </NavLink>
              <NavLink to="/dashboard/loansAppLication" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Loan Applications
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
