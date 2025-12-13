
import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-4">Page Not Found</p>
      <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Go Home
      </Link>
    </div>
  );
}
