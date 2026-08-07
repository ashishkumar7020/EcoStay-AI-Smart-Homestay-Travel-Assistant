import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const principles = [
  ["Direct by default", "Help owners stay closer to their guests and their booking decisions."],
  ["Local knowledge matters", "Turn useful local context into plans guests can actually use."],
  ["Sustainability, made practical", "Make lower-impact choices feel clear rather than complicated."]
];

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-emerald-100 bg-skysoft py-20 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Our mission</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-forest dark:text-emerald-100 sm:text-6xl">Better stays begin with better tools.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">EcoStay AI gives homestay owners a more focused way to manage reservations and gives travelers a thoughtful starting point for planning locally.</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Why it exists</p><h2 className="mt-3 text-3xl font-bold text-forest dark:text-emerald-100">Built for the human side of hospitality.</h2><p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">The platform brings booking operations and AI assistance into one calm workspace. Owners can make faster decisions without losing the personal detail that makes a homestay memorable.</p><Link to="/ai-assistant" className="mt-8 inline-flex rounded-md bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-leaf dark:text-slate-950">Explore the AI workspace</Link></div>
          <img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1100&q=85" alt="A warm cabin surrounded by trees" className="h-full min-h-[330px] w-full rounded-lg object-cover shadow-soft" loading="lazy" />
        </section>
        <section className="bg-forest py-20 text-white dark:bg-slate-900"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Our principles</p><div className="mt-8 grid gap-5 md:grid-cols-3">{principles.map(([title, text], index) => <article key={title} className="border-t border-emerald-300/50 pt-5"><p className="text-sm font-bold text-emerald-200">0{index + 1}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-200">{text}</p></article>)}</div></div></section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
