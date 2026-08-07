import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { apiUrl, saveSession, logout } = useAuth();

  useEffect(() => {
    async function completeOAuth() {
      const token = params.get("token");
      if (!token) {
        logout();
        navigate("/login?oauth=failed", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "OAuth login failed");
        saveSession(token, data.user);
        navigate("/dashboard", { replace: true });
      } catch {
        logout();
        navigate("/login?oauth=failed", { replace: true });
      }
    }

    completeOAuth();
  }, [apiUrl, logout, navigate, params, saveSession]);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-4 text-emerald-100">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">EcoStay AI</p>
        <span className="mx-auto mt-7 block h-10 w-10 animate-spin rounded-full border-4 border-emerald-900 border-t-leaf" aria-hidden="true" />
        <h1 className="mt-6 text-2xl font-bold">Completing secure sign-in...</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Please keep this page open while your account is verified.</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
