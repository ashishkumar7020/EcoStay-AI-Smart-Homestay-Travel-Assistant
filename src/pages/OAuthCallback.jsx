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
    <div className="grid min-h-screen place-items-center bg-slate-950 text-emerald-100">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">EcoStay AI</p>
        <h1 className="mt-3 text-2xl font-bold">Completing secure sign-in...</h1>
      </div>
    </div>
  );
}

export default OAuthCallback;
