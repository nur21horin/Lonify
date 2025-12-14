import React, { Children } from 'react'
import useAuth from '../../../hooks/useAuth'
import { Navigate } from 'react-router';

const ManagerRoute = () => {
  const {user,role,loading}=useAuth();
  if (loading) {
    return <span className="loading loading-spinner"></span>;
  }
  if(user && role==="manager") return Children;
  return <Navigate to={"/"}></Navigate>
 
}

export default ManagerRoute
