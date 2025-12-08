import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
  ],
  loans: [
    { name: "Personal Loans", href: "/loans?category=personal" },
    { name: "Business Loans", href: "/loans?category=business" },
    { name: "Home Loans", href: "/loans?category=home" },
    { name: "Education Loans", href: "/loans?category=education" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Loan Calculator", href: "/calculator" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Licensing", href: "/licensing" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-50 border-t border-gray-200 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md font-bold">
                L
              </div>
              <span className="text-xl font-bold text-gray-800">
                Loan<span className="text-indigo-600">ify</span>
              </span>
            </Link>

            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Empowering your financial future with trusted loan solutions.
              Fast approvals, competitive rates, and personalized service.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-gray-600 text-sm">
              <a
                href="mailto:support@loanify.com"
                className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
              >
                <Mail className="h-4 w-4" /> support@loanify.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
              >
                <Phone className="h-4 w-4" /> 01321526442
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Block 3, Mirpur 11
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-indigo-500 text-gray-700 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-gray-800 font-semibold mb-4">{title.charAt(0).toUpperCase() + title.slice(1)}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-500 text-sm hover:text-indigo-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Loanify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
