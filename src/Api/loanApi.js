import axiosPublic from "./axiosPublic";
import axiosSecure from "./axiosSecure";

/* ---------------- PUBLIC ---------------- */

// Home Featured Loans
export const getFeaturedLoans = async () => {
  const res = await axiosPublic.get("/public/loans");
  return res.data;
};

/* ---------------- AUTH ---------------- */

// Create JWT cookie
export const createJWT = async (user) => {
  const res = await axiosPublic.post("/jwt", user);
  return res.data;
};

/* ---------------- LOANS ---------------- */

// All loans (logged in)
export const getAllLoans = async () => {
  const res = await axiosSecure.get("/loans");
  return res.data;
};

// Loan details
export const getLoanDetails = async (id) => {
  const res = await axiosSecure.get(`/loans/${id}`);
  return res.data;
};

/* ---------------- LOAN APPLICATION ---------------- */

export const applyLoan = async (data) => {
  const res = await axiosSecure.post("/loan-applications", data);
  return res.data;
};

export const payApplicationFee = async (id, transactionId) => {
  const res = await axiosSecure.patch(`/loan-applications/${id}/pay`, {
    transactionId,
  });
  return res.data;
};

/* ---------------- USER ---------------- */

export const getMyApplications = async () => {
  const res = await axiosSecure.get("/loan-applications");
  return res.data;
};

/* ---------------- MANAGER ---------------- */

export const addLoan = async (loan) => {
  const res = await axiosSecure.post("/loans", loan);
  return res.data;
};

export const getManagerLoans = async () => {
  const res = await axiosSecure.get("/manager/loans");
  return res.data;
};

export const updateLoan = async (id, data) => {
  const res = await axiosSecure.patch(`/loans/${id}`, data);
  return res.data;
};

export const approveApplication = async (id) => {
  const res = await axiosSecure.patch(`/loan-applications/${id}/approve`);
  return res.data;
};

export const rejectApplication = async (id) => {
  const res = await axiosSecure.patch(`/loan-applications/${id}/reject`);
  return res.data;
};

/* ---------------- ADMIN ---------------- */

export const getUsers = async (page = 1) => {
  const res = await axiosSecure.get(`/users?page=${page}`);
  return res.data;
};

export const changeUserRole = async (email, role) => {
  const res = await axiosSecure.patch(`/users/${email}/role`, { role });
  return res.data;
};

export const suspendUser = async (email, reason) => {
  const res = await axiosSecure.patch(`/users/${email}/suspend`, { reason });
  return res.data;
};

export const toggleLoanHome = async (id, showOnHome) => {
  const res = await axiosSecure.patch(`/loans/${id}/show`, { showOnHome });
  return res.data;
};
