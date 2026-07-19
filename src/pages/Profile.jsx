import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-emerald-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Protected page</p>
          <h1 className="mt-3 text-4xl font-bold text-forest dark:text-emerald-100">Account Profile</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            This page is protected by the React route guard and is visible only after login.
          </p>
          <div className="mt-8 grid gap-4 rounded-lg bg-emerald-50 p-5 dark:bg-slate-950">
            <p className="text-sm text-slate-600 dark:text-slate-300">Signed in as</p>
            <p className="text-xl font-bold text-forest dark:text-emerald-100">{user?.email}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Provider: {user?.provider}</p>
          </div>
          <div className="mt-8">
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
