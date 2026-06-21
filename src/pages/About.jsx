import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Our mission</p>
          <h1 className="mt-4 text-4xl font-bold text-forest dark:text-emerald-100 sm:text-5xl">About EcoStay AI</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
            EcoStay AI helps homestay owners grow their businesses by increasing direct bookings, reducing dependency on
            third-party platforms, and improving daily operations with intelligent tools. The platform is also designed to
            create better travel experiences by giving guests personalized trip plans, local recommendations, and fast
            assistance before and during their stay.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
