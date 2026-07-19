import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, apiUrl } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const redirectTo = location.state?.from || "/dashboard";

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      if (mode === "login") await login({ email: form.email, password: form.password });
      else await register({ email: form.email, password: form.password, name: form.name });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

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

        <form onSubmit={handleSubmit} className="w-full rounded-lg border border-emerald-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-emerald-50 p-1 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-forest text-white dark:bg-leaf dark:text-slate-950" : "text-forest dark:text-emerald-100"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-forest text-white dark:bg-leaf dark:text-slate-950" : "text-forest dark:text-emerald-100"}`}
            >
              Register
            </button>
          </div>

          {params.get("oauth") === "failed" && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              OAuth login could not be completed. Check the backend OAuth configuration.
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-700">
              {message}
            </div>
          )}

          <div className="space-y-5">
            {mode === "register" && (
              <Input id="name" name="name" label="Name" placeholder="Ashish Kumar" value={form.name} onChange={handleChange} />
            )}
            <Input id="email" name="email" label="Email address" type="email" placeholder="owner@ecostay.ai" value={form.email} onChange={handleChange} required />
            <Input id="password" name="password" label="Password" type="password" placeholder="At least 8 characters with a number" value={form.password} onChange={handleChange} required minLength={8} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Please wait" : mode === "login" ? "Login" : "Create account"}</Button>
            <a
              className="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-forest transition hover:bg-emerald-50 dark:border-slate-700 dark:text-emerald-100 dark:hover:bg-slate-800"
              href={`${apiUrl}/auth/github`}
            >
              Sign in with GitHub
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
