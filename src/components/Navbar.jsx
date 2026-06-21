import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

const links = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Login", path: "/login" }
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-forest text-white dark:bg-leaf dark:text-slate-950"
        : "text-ink hover:bg-skysoft hover:text-forest dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-emerald-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-forest text-lg font-bold text-white dark:bg-leaf dark:text-slate-950">
            E
          </span>
          <span className="text-xl font-bold text-forest dark:text-emerald-100">EcoStay AI</span>
        </NavLink>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-emerald-100 text-forest dark:border-slate-700 dark:text-emerald-100"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? "L" : "D"}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-emerald-100 text-forest dark:border-slate-700 dark:text-emerald-100"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            <span className="text-2xl leading-none">{isOpen ? "x" : "="}</span>
          </button>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-2 rounded-md border border-emerald-100 px-3 py-2 text-sm font-semibold text-forest transition hover:bg-skysoft dark:border-slate-700 dark:text-emerald-100 dark:hover:bg-slate-800"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-emerald-100 bg-white px-4 pb-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-3">
            {links.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass} onClick={() => setIsOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
