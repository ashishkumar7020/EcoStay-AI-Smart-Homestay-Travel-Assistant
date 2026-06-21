import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input } from "../components/ui/index.js";

function Login() {
  return (
    <div className="flex min-h-screen flex-col bg-skysoft dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Welcome back</p>
          <h1 className="mt-4 text-4xl font-bold text-forest dark:text-emerald-100 sm:text-5xl">Login to EcoStay AI</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            Access your homestay management dashboard and AI travel tools.
          </p>
        </section>

        <form className="w-full rounded-lg border border-emerald-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="space-y-5">
            <Input id="email" label="Email address" type="email" placeholder="owner@ecostay.ai" />
            <Input id="password" label="Password" type="password" placeholder="Enter your password" />
            <Button className="w-full">Login</Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
