
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../Firebase/Firebase.init";

export default function Profile() {
  const { user: authUser, logOut } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchUser = async () => {
      if (authUser) {
        setLoading(true);
        try {
          const docRef = doc(db, "users", authUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ ...authUser, ...docSnap.data() });
          } else {
            setUser(authUser);
          }
        } catch (error) {
          toast.error("Failed to load user data");
          setUser(authUser);
        }
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    };
    fetchUser();
  }, [authUser]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      if(!user){
        navigate("/");
      }
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handleUpdate = () => {
    toast.info("Profile update");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <span className="loading loading-spinner text-4xl"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          No user found
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded p-6 mt-6">
      <ToastContainer />
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user.photoURL || "https://via.placeholder.com/80"}
          alt="User Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {user.displayName || user.name || "User"}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
          <p className="text-gray-500 dark:text-gray-300 capitalize">
            {user.role || "borrower"}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          <FiLogOut /> Logout
        </button>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>

    
      <div className="mt-6 text-gray-700 dark:text-gray-300">
        <p>
          <strong>User ID:</strong> {user.uid}
        </p>
      </div>
    </div>
  );
}
