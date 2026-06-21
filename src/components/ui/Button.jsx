import React from "react";

/**
 * Button props:
 * @param {"primary" | "secondary" | "outline"} variant - Visual button style.
 * @param {"sm" | "md" | "lg"} size - Button height and padding.
 * @param {boolean} disabled - Disables interaction and dims the button.
 * @param {Function} onClick - Click handler.
 * @param {string} type - Native button type.
 * @param {React.ReactNode} children - Button content.
 * @param {string} className - Optional extra classes.
 */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  children,
  className = ""
}) {
  const variants = {
    primary: "bg-forest text-white hover:bg-emerald-800 dark:bg-leaf dark:text-slate-950 dark:hover:bg-emerald-300",
    secondary:
      "bg-skysoft text-forest hover:bg-emerald-100 dark:bg-slate-800 dark:text-emerald-100 dark:hover:bg-slate-700",
    outline:
      "border border-emerald-200 bg-transparent text-forest hover:bg-skysoft dark:border-slate-600 dark:text-emerald-100 dark:hover:bg-slate-800"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-emerald-900 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
