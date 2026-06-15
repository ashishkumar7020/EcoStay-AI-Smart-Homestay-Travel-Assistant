import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Card from "../components/Card.jsx";
import Footer from "../components/Footer.jsx";

const features = [
  {
    title: "Direct Booking System",
    description: "Allow guests to book directly without third-party commissions."
  },
  {
    title: "AI Travel Assistant",
    description: "Get instant travel recommendations, destination information, and local guidance."
  },
  {
    title: "Personalized Trip Planner",
    description: "Create custom itineraries based on budget, duration, and interests."
  },
  {
    title: "Booking Analytics Dashboard",
    description: "Monitor occupancy rates, booking trends, and business insights."
  }
];

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">Platform features</p>
            <h2 className="mt-3 text-3xl font-bold text-forest sm:text-4xl">Built for better stays and smarter trips</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} title={feature.title} description={feature.description} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
