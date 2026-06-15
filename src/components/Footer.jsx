import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Login", path: "/login" }
];

function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-forest text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-bold">EcoStay AI</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100">
              Smart tools for homestay owners and modern travelers.
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
          <div className="flex gap-3" aria-label="Social links">
            {["f", "in", "x"].map((icon) => (
              <span
                key={icon}
                className="grid h-9 w-9 place-items-center rounded-md border border-white/20 text-sm font-semibold text-emerald-100"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
