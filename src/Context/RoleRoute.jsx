// Context/RoleRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // spinner while checking

  if (!user) return <Navigate to="/login" replace />; // not logged in

  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />; // role not allowed

  return children;
};

export default RoleRoute;
