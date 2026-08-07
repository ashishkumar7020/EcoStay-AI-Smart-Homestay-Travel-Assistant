import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative isolate min-h-[690px] overflow-hidden bg-slate-950 text-white">
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85"
        alt="A forested mountain landscape for an eco-conscious getaway"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/55" />
      <div className="mx-auto flex min-h-[690px] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Thoughtful stays, better journeys</p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.04] sm:text-6xl lg:text-7xl">EcoStay AI</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">
            A calm, intelligent workspace for homestay owners and guests who want travel to feel more local, useful, and sustainable.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/dashboard" className="inline-flex rounded-md bg-leaf px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200">
              Open owner dashboard
            </Link>
            <Link to="/ai-assistant" className="inline-flex rounded-md border border-white/45 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/30">
              Plan with AI
            </Link>
          </div>
        </div>
        <div className="mt-14 grid max-w-3xl grid-cols-3 border-t border-white/25 pt-5 text-sm text-slate-100 sm:gap-8">
          <div><strong className="block text-2xl text-white">4.9/5</strong>guest-ready experience</div>
          <div><strong className="block text-2xl text-white">24/7</strong>AI planning tools</div>
          <div><strong className="block text-2xl text-white">Low-impact</strong>travel first</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
