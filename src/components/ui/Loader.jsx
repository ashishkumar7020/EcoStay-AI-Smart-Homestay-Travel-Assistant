import React from "react";

/**
 * Loader props:
 * @param {"spinner" | "skeleton"} variant - Loading indicator style.
 * @param {string} label - Accessible loading label.
 */
function Loader({ variant = "spinner", label = "Loading" }) {
  if (variant === "skeleton") {
    return (
      <div className="space-y-3" role="status" aria-label={label}>
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 text-sm font-semibold text-forest dark:text-emerald-100" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-forest dark:border-slate-700 dark:border-t-leaf" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
