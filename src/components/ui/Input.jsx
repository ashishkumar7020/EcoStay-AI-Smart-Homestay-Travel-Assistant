import React from "react";

/**
 * Input props:
 * @param {string} label - Visible field label.
 * @param {string} placeholder - Placeholder text.
 * @param {string} type - Native input type.
 * @param {string} value - Controlled input value.
 * @param {Function} onChange - Change handler.
 * @param {string} error - Error message displayed below the field.
 * @param {string} id - Input id for label association.
 * @param {string} className - Optional extra classes.
 */
function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  id,
  className = ""
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || "input-field";

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`mt-2 w-full rounded-md border bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-leaf focus:ring-4 focus:ring-emerald-100 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-emerald-950 ${
          error ? "border-rose-300 dark:border-rose-500" : "border-slate-200 dark:border-slate-700"
        }`}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
