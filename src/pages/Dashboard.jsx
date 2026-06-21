import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, Loader, Modal, Toast } from "../components/ui/index.js";

const stats = [
  {
    title: "Occupancy Rate",
    value: "78%",
    description: "Current estimated occupancy across listed rooms."
  },
  {
    title: "Monthly Bookings",
    value: "126",
    description: "Confirmed direct and assisted bookings this month."
  },
  {
    title: "Revenue Growth",
    value: "+18%",
    description: "Month-over-month improvement from repeat stays and direct reservations."
  }
];

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Owner overview</p>
          <h1 className="mt-4 text-4xl font-bold text-forest dark:text-emerald-100 sm:text-5xl">Business Dashboard</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            This page will display booking statistics, occupancy data, and performance analytics in future development
            phases.
          </p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} title={stat.title} value={stat.value} description={stat.description} />
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">
                  AI travel assistant
                </p>
                <h2 className="mt-3 text-2xl font-bold text-forest dark:text-emerald-100">Generate guest itinerary</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                  Create a quick guest itinerary from a destination, local experiences, and homestay recommendations.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                Preview
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <Input
                label="Destination"
                placeholder="Munnar, Kerala"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                error={destination.length > 0 && destination.length < 3 ? "Enter at least 3 characters." : ""}
              />
              <Button onClick={handleGeneratePlan} disabled={isLoading || destination.length < 3}>
                {isLoading ? "Generating" : "Generate plan"}
              </Button>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 p-5 dark:border-slate-700">
              {isLoading ? (
                <Loader variant="skeleton" label="Generating itinerary" />
              ) : (
                <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-forest dark:text-emerald-100">Suggested guest flow</p>
                  <p>Morning tea estate walk, local lunch spot, waterfall visit, and a quiet homestay dinner.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">
              Owner tools
            </p>
            <h2 className="mt-3 text-2xl font-bold text-forest dark:text-emerald-100">Quick actions</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" size="sm" onClick={() => setShowToast(true)}>
                Toast
              </Button>
              <Button variant="secondary" size="md" onClick={() => setIsModalOpen(true)}>
                Modal
              </Button>
              <Button variant="outline" size="lg" disabled>
                Disabled
              </Button>
            </div>
            <div className="mt-6">
              <Loader label="Syncing bookings" />
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="AI itinerary preview">
        <p className="leading-7">
          EcoStay AI can turn owner notes into a guest-friendly itinerary with local experiences, check-in guidance, and
          direct booking suggestions.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setIsModalOpen(false)}>Done</Button>
        </div>
      </Modal>
      <Toast show={showToast} message="AI itinerary draft is ready." onDismiss={() => setShowToast(false)} />
    </div>
  );
}

export default Dashboard;
