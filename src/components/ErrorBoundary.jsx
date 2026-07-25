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
        <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
          <section className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-xl font-bold text-forest dark:text-emerald-100">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Please refresh the page and try again.</p>
            <button type="button" className="mt-5 rounded-md bg-forest px-4 py-2 text-sm font-semibold text-white" onClick={() => window.location.reload()}>
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
