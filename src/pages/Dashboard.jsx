import React from "react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";
import Footer from "../components/Footer.jsx";

const stats = [
  {
    title: "Occupancy Rate",
    value: "78%",
    description: "Placeholder metric for current room occupancy."
  },
  {
    title: "Monthly Bookings",
    value: "126",
    description: "Placeholder count for direct and assisted bookings."
  },
  {
    title: "Revenue Growth",
    value: "+18%",
    description: "Placeholder indicator for month-over-month performance."
  }
];

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">Owner overview</p>
          <h1 className="mt-4 text-4xl font-bold text-forest sm:text-5xl">Business Dashboard</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            This page will display booking statistics, occupancy data, and performance analytics in future development
            phases.
          </p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} title={stat.title} value={stat.value} description={stat.description} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
