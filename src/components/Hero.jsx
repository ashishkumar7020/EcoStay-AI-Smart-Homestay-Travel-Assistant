import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-skysoft">
      <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-leaf">
            Homestay growth and travel intelligence
          </p>
          <h1 className="text-4xl font-bold leading-tight text-forest sm:text-5xl lg:text-6xl">
            Smart Homestay Management Powered by AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            Increase direct bookings, enhance guest experiences, and plan unforgettable trips with intelligent travel
            assistance.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex rounded-md bg-forest px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Explore EcoStay AI
          </Link>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-soft">
          <div className="rounded-md bg-forest p-5 text-white">
            <p className="text-sm text-emerald-100">Today at Green Valley Homestay</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold">82%</p>
                <p className="text-sm text-emerald-100">Occupancy</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-emerald-100">Direct bookings</p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {["AI guest reply drafted", "3-day local itinerary ready", "Weekend demand is rising"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md border border-emerald-100 p-4">
                <span className="text-sm font-medium text-slate-700">{item}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-leaf" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
