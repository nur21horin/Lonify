import React, { Children } from 'react'
import useAuth from '../../../hooks/useAuth';

const AdminROute = () => {
  const {user,role,loading}=useAuth();
 if (loading) return <p>Loading...</p>;
  if (user && role === "admin") return ;

  return <Navigate to="/" />;
}

export default AdminROute
