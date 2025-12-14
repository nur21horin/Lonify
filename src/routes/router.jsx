import { createBrowserRouter } from "react-router-dom";
import Rootlayout from "../layout/Rootlayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "../layout/PrivateLayout";
import AllLoans from "../pages/AllLoans/AllLoans";
import LoanDetails from "../pages/LoanDetails/LoanDetails";
import loanData from "../Api/LoanDetails.json";
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

// Loader for all loans
const allLoanLoader = async () => {
  return loanData; // array from JSON
};

// Loader for specific loan details
const loanDetailsLoader = async ({ params }) => {
  const loan = loanData.find((l) => l.id === params.id);
  if (!loan) throw new Response("Loan not found", { status: 404 });
  return loan;
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
        loader: allLoanLoader, // ensure loader returns the array
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
            path: "myLoans",
            Component: MyLoans,
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
            Component: AddLoan,
          },
          {
            path: "manageLoan",
            Component: ManageLoans,
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
            Component:ManageUsers,
          },{
            path:"allLoans",
            Component:AllLoansAdmin
          },{
            path:"loansAppLication",
            Component:LoanApplicationsAdmin
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
