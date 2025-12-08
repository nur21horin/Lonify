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
    <div>
      <footer className="border-t border-border bg-secondary/30">
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-6">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-md">
                  <span className="text-xl font-bold text-primary-foreground">
                    L
                  </span>
                </div>
                <span className="text-xl font-heading font-bold text-foreground">
                  Loan<span className="text-primary">ify</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Empowering your financial future with trusted loan solutions.
                Fast approvals, competitive rates, and personalized service.
              </p>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <a
                  href="mailto:support@loanify.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  support@loanify.com
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +1 (234) 567-890
                </a>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  123 Finance Street, NY 10001
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
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
              <div>
                <h3 className="font-heading font-semibold text-foreground">
                  Company
                </h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">
                  Loan Types
                </h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.loans.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">
                  Support
                </h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">
                  Legal
                </h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Loanify. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for your financial success
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
