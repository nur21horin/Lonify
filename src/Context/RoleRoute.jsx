// routes/RoleRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";


const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default RoleRoute;
