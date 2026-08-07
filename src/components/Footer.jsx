import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "AI Assistant", path: "/ai-assistant" },
  { label: "Login", path: "/login" }
];

function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-forest text-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-bold">EcoStay AI</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100">
              Calm tools for homestay owners and travelers who choose more thoughtful stays.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {footerLinks.map((link) => (
              <Link key={link.path} to={link.path} className="text-sm text-emerald-100 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-center">
          <p className="text-sm text-emerald-100">Copyright &copy; 2026 EcoStay AI. All rights reserved.</p>
          <p className="text-sm font-semibold text-emerald-100">Built for direct bookings and local travel.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
