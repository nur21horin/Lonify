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
import LoanApplicationForm from "../pages/Dashboard/AdminDashboard/LoanApplication";

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
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout></DashboardLayout>
          </PrivateRoute>
        ),
      },
      {
        path:"loanapplicationform",
        Component:LoanApplicationForm
      }
    ],
  },
  { path: "login", Component: Login },
  { path: "register", Component: Register },

  {
    path: "*",
    Component: ErrorPage,
  },
]);
