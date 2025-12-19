import { createBrowserRouter } from "react-router-dom";
import Rootlayout from "../layout/Rootlayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "../layout/PrivateLayout";
import AllLoans from "../pages/AllLoans/AllLoans";
import LoanDetails from "../pages/LoanDetails/LoanDetails";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import ErrorPage from "../pages/ErrorPage";
import Profile from "../pages/Dashboard/Profile";

import MyLoans from "../pages/Dashboard/UserDashBoard/MyLoans";
import LoanApplicationForm from "../pages/Dashboard/UserDashBoard/LoanApplicationForm";
import AddLoan from "../pages/Dashboard/ManagerDashBoard/AddLoan";
import ManageLoans from "../pages/Dashboard/ManagerDashBoard/ManageLoan";
import PendingApplications from "../pages/Dashboard/ManagerDashBoard/PendingLoan";
import ApprovedApplications from "../pages/Dashboard/ManagerDashBoard/ApprovedLoanApplication";
import UpdateLoan from "../pages/Dashboard/ManagerDashBoard/UpdateLoan";
import ManageUsers from "../pages/Dashboard/AdminDashboard/ManageUsers";
import AllLoansAdmin from "../pages/Dashboard/AdminDashboard/AllLoansAdmin";
import LoanApplicationsAdmin from "../pages/Dashboard/AdminDashboard/LoanApplication";
import LoanPayment from "../pages/Dashboard/UserDashBoard/LoanPayemnt";
import FeatureLoans from "../pages/AllLoans/FeatureLoans";
import RoleRoute from "../Context/RoleRoute";
import PendingLoans from "../pages/Dashboard/ManagerDashBoard/PendingLoan";
import { getAuth } from "firebase/auth";

const loanDetailsLoader = async ({ params }) => {
  const auth = getAuth();

  if (!auth.currentUser) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const token = await auth.currentUser.getIdToken();

  const res = await fetch(`https://lonify-server-side.onrender.com/loans/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Response("Loan not found", { status: res.status });
  }

  return res.json();
};



export const router = createBrowserRouter([
  {
    path: "/",
    Component: Rootlayout,
    children: [
      { index: true, Component: Home },
      {
        path: "loans",
        element: (
          <PrivateRoute>
            <AllLoans />
          </PrivateRoute>
        ),
      },
      {
        path: "featureLoans",
        Component: (
          <PrivateRoute>
            <FeatureLoans></FeatureLoans>
          </PrivateRoute>
        ),
        
      },
      {
        path: "loans/:id",
        element: (
          <PrivateRoute>
            <LoanDetails />
          </PrivateRoute>
        ),
        loader: loanDetailsLoader,
      },

      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout></DashboardLayout>
          </PrivateRoute>
        ),
        children: [
          {
            path: "my-loans",
            //Component: MyLoans,
            element: (
              <RoleRoute allowedRoles={["user", "admin", "borrower"]}>
                <MyLoans></MyLoans>
              </RoleRoute>
            ),
          },
          {
            path: "pay-fee/:id",
            element: (
              <RoleRoute allowedRoles={["user", "admin", "borrower"]}>
                <LoanPayment></LoanPayment>
              </RoleRoute>
            ),
          },
          {
            path: "apply-loan/:id",
            Component: LoanApplicationForm,
            loader: loanDetailsLoader,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          //Manager
          {
            path: "addLoan",
            element: (
              <RoleRoute allowedRoles={["manager"]}>
                <AddLoan />
              </RoleRoute>
            ),
          },
          {
            path: "manageLoan",
            element: (
              <RoleRoute allowedRoles={["manager"]}>
                <ManageLoans />
              </RoleRoute>
            ),
          },
          {
            path: "pending-loans",
            element: (
              <RoleRoute allowedRoles={["manager"]}>
                <PendingLoans></PendingLoans>
              </RoleRoute>
            ),
          },
          {
            path: "updateLoan/:id",
            Component: UpdateLoan,
          },
          {
            path: "pendingApplication",
            Component: PendingApplications,
          },
          {
            path: "approvedLoans",
            Component: ApprovedApplications,
          },
          {
            path: "manageUsers",
            element: (
              <RoleRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </RoleRoute>
            ),
          },
          {
            path: "allLoans",
            element: (
              <RoleRoute allowedRoles={["admin"]}>
                <AllLoansAdmin />
              </RoleRoute>
            ),
          },
          {
            path: "loansAppLication",
            element: (
              <RoleRoute allowedRoles={["admin"]}>
                <LoanApplicationsAdmin />
              </RoleRoute>
            ),
          },
        ],
      },
    ],
  },
  { path: "login", Component: Login },
  { path: "register", Component: Register },

  {
    path: "*",
    Component: ErrorPage,
  },
]);
