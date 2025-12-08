import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const navLinksBeforeLogin = [
  { name: "Home", href: "/" },
  { name: "All Loans", href: "/loans" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const navLinksAfterLogin = [
  { name: "Home", href: "/" },
  { name: "All Loans", href: "/loans" },
  { name: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const location = useLocation();
  const { user, logOut } = useAuth();

  // Apply theme on load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logOut()
      .then(() => toast.success("Logout successful"))
      .catch((err) => toast.error("Logout failed"));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const links = user ? navLinksAfterLogin : navLinksBeforeLogin;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900/95 shadow-md backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition p-1"
          >
            <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md font-bold">
              L
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Loan<span className="text-indigo-600">ify</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-all ${
                  location.pathname === link.href
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || "https://via.placeholder.com/32"}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full border-2 border-blue-600"
                />
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden mt-2"
            >
              <div className="flex flex-col gap-1 py-3 px-2 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2 rounded-md transition ${
                      location.pathname === link.href
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {!user && (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Register
                    </Link>
                  </div>
                )}

                {user && (
                  <div className="flex items-center justify-between mt-2">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/32"}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full border-2 border-blue-600"
                    />
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}

                <button
                  onClick={toggleTheme}
                  className="mt-2 p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
