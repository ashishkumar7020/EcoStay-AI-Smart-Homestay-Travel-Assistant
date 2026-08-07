import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { Button } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user, logout } = useAuth();
  const initial = (user?.name || user?.email || "E").slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="bg-forest px-6 py-10 text-white dark:bg-slate-950 sm:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Account</p><div className="mt-6 flex flex-wrap items-center gap-5"><span className="grid h-16 w-16 place-items-center rounded-full bg-leaf text-2xl font-bold text-slate-950">{initial}</span><div><h1 className="text-3xl font-bold">{user?.name || "EcoStay member"}</h1><p className="mt-1 text-slate-200">Your private owner workspace</p></div></div></div>
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.1fr_0.9fr]"><section><h2 className="text-xl font-bold text-forest dark:text-emerald-100">Account details</h2><dl className="mt-5 divide-y divide-emerald-100 rounded-lg border border-emerald-100 dark:divide-slate-800 dark:border-slate-800"><div className="flex justify-between gap-4 p-4"><dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt><dd className="break-all text-right text-sm font-semibold text-forest dark:text-emerald-100">{user?.email}</dd></div><div className="flex justify-between gap-4 p-4"><dt className="text-sm text-slate-500 dark:text-slate-400">Sign-in provider</dt><dd className="text-sm font-semibold capitalize text-forest dark:text-emerald-100">{user?.provider || "email"}</dd></div><div className="flex justify-between gap-4 p-4"><dt className="text-sm text-slate-500 dark:text-slate-400">Access</dt><dd className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Protected account</dd></div></dl></section><aside className="rounded-lg bg-emerald-50 p-5 dark:bg-slate-950"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-leaf dark:text-emerald-300">Quick actions</p><h2 className="mt-3 text-2xl font-bold text-forest dark:text-emerald-100">Keep your stays moving.</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Review reservations or use the assistant to prepare guest-facing content.</p><div className="mt-6 grid gap-3"><Link to="/dashboard" className="rounded-md bg-forest px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-leaf dark:text-slate-950">Open dashboard</Link><Link to="/ai-assistant" className="rounded-md border border-emerald-200 px-4 py-3 text-center text-sm font-semibold text-forest transition hover:bg-white dark:border-slate-700 dark:text-emerald-100 dark:hover:bg-slate-900">Open AI Assistant</Link><Button variant="secondary" onClick={logout}>Logout securely</Button></div></aside></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
