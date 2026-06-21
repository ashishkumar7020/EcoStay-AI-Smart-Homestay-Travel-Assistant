import React, { useEffect } from "react";

/**
 * Toast props:
 * @param {boolean} show - Controls toast visibility.
 * @param {string} message - Notification message.
 * @param {"success" | "info"} type - Visual toast tone.
 * @param {Function} onDismiss - Called after timeout or dismiss click.
 * @param {number} duration - Milliseconds before auto-dismiss.
 */
function Toast({ show, message, type = "success", onDismiss, duration = 2800 }) {
  useEffect(() => {
    if (!show) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onDismiss?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, onDismiss, show]);

  if (!show) {
    return null;
  }

  const tone =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-forest dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
      : "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100";

  return (
    <div className="fixed right-4 top-24 z-[70] w-[calc(100%-2rem)] max-w-sm" role="status" aria-live="polite">
      <div className={`flex items-center justify-between gap-4 rounded-lg border p-4 shadow-soft ${tone}`}>
        <p className="text-sm font-semibold">{message}</p>
        <button type="button" onClick={onDismiss} className="text-lg leading-none" aria-label="Dismiss notification">
          x
        </button>
      </div>
    </div>
  );
}

export default Toast;
