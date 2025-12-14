import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetchRole = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/users/${user.email}/role`
        );
        setRole(res.data.role);
      } catch (error) {
        console.error("Failed to fetch role:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [user]);
  return { role, loading };
};

export default useUserRole;
