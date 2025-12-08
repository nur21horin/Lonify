import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Loans", href: "/loans" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <span className="text-xl font-bold">L</span>
            </div>
            <span className="text-xl font-bold">
              Loan<span className="text-blue-600">ify</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={
                  "text-sm font-medium transition-colors " +
                  (location.pathname === link.href
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900")
                }
              >
                {link.name}
              </Link>
            ))}

            {!isLoggedIn && (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md border"
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
              className="lg:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 py-3">

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      "px-4 py-2 rounded-md transition-colors " +
                      (location.pathname === link.href
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
                    }
                  >
                    {link.name}
                  </Link>
                ))}

                {!isLoggedIn && (
                  <div className="flex gap-3 px-4 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 text-center py-2 border rounded-md hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Register
                    </Link>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
