import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function Login() {
  return (
    <div className="flex min-h-screen flex-col bg-skysoft">
      <Navbar />
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">Welcome back</p>
          <h1 className="mt-4 text-4xl font-bold text-forest sm:text-5xl">Login to EcoStay AI</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
            Access your homestay management dashboard and AI travel tools.
          </p>
        </section>

        <form className="w-full rounded-lg border border-emerald-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="owner@ecostay.ai"
                className="mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-leaf focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-leaf focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-md bg-forest px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              Login
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
