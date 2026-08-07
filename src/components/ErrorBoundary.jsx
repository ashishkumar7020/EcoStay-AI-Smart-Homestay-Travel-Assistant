import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Unexpected UI error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-skysoft px-4 dark:bg-slate-950">
          <section className="w-full max-w-md rounded-lg border border-emerald-100 bg-white p-8 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">EcoStay AI</p>
            <div className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-2xl font-bold text-forest dark:bg-emerald-950 dark:text-emerald-100">!</div>
            <h1 className="mt-5 text-2xl font-bold text-forest dark:text-emerald-100">This screen needs a fresh start.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">An unexpected interface error occurred. Your account and booking data have not been changed.</p>
            <button type="button" className="mt-6 rounded-md bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:bg-leaf dark:text-slate-950" onClick={() => window.location.reload()}>
              Refresh page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
