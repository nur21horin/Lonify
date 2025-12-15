import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase.init";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();
const ADMIN_EMAIL = "admin1@gmail.com";
const ADMIN_PASSWORD = "Asdfghjkl:";
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInuser = (email, password) => {
    setLoading(true);
    // if (email === ADMIN_EMAIL && password !== ADMIN_PASSWORD) {
    //   setLoading(false);
    //   throw new Error("Invalid admin credentials");
    // }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const fetchUserRole = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${email}/role`, {
        withCredentials: true,
      });
      return res.data.role || "borrower";
    } catch (err) {
      console.error("Failed to fetch role:", err);
      return "borrower";
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);

        let finalRole;

        if (currentUser.email === ADMIN_EMAIL) {
          finalRole = "admin";
        } else {
          finalRole = await fetchUserRole(currentUser.email);
        }

        setUser({ ...currentUser, role: finalRole });
        setRole(finalRole);
      } else {
        setFirebaseUser(null);
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  const authInfo = {
    loading,
    user,
    role,
    firebaseUser,
    createUser: registerUser,
    signInuser,
    signInGoogle,
    logOut,
    updateUserProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
