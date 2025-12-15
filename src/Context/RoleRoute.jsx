// Context/RoleRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role))
    return <Navigate to="/dashboard" replace />; // role not allowed

  return children;
};

export default RoleRoute;
