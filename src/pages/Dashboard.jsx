import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, Loader, Modal, Toast } from "../components/ui/index.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("AI itinerary draft is ready.");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [apiError, setApiError] = useState("");

  async function loadDashboardData(query = "") {
    setIsLoading(true);
    setApiError("");

    try {
      const bookingsEndpoint = query.trim()
        ? `${API_URL}/bookings/search?q=${encodeURIComponent(query.trim())}`
        : `${API_URL}/bookings`;
      const [bookingsResponse, statsResponse] = await Promise.all([fetch(bookingsEndpoint), fetch(`${API_URL}/bookings/stats`)]);

      if (!bookingsResponse.ok || !statsResponse.ok) {
        throw new Error("Backend API request failed");
      }

      const bookingsJson = await bookingsResponse.json();
      const statsJson = await statsResponse.json();

      setBookings(bookingsJson.data);
      setApiStats(statsJson.data);
    } catch (error) {
      setApiError(error.message);
      setToastMessage("Could not load backend data. Start the API server and retry.");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Live Bookings",
        value: apiStats ? String(apiStats.totalBookings) : "--",
        description: "Bookings loaded from the Express backend API."
      },
      {
        title: "Confirmed Stays",
        value: apiStats ? String(apiStats.confirmedBookings) : "--",
        description: "Confirmed reservations currently held in backend memory."
      },
      {
        title: "Eco Score",
        value: apiStats ? `${apiStats.averageSustainabilityScore}/100` : "--",
        description: "Average sustainability score returned by the stats endpoint."
      }
    ],
    [apiStats]
  );

  const handleGeneratePlan = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setToastMessage("AI itinerary draft is ready.");
      setShowToast(true);
    }, 900);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadDashboardData(searchQuery);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Owner overview</p>
          <h1 className="mt-4 text-4xl font-bold text-forest dark:text-emerald-100 sm:text-5xl">Business Dashboard</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            Live booking statistics, reservation data, and sustainability signals now flow from the Week 4 Express API.
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

            <form className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end" onSubmit={handleSearch}>
              <Input
                label="Search live bookings"
                placeholder="Munnar, confirmed, guest name"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                error={searchQuery.length > 0 && searchQuery.length < 2 ? "Enter at least 2 characters." : ""}
              />
              <Button type="submit" disabled={isLoading || (searchQuery.length > 0 && searchQuery.length < 2)}>
                {isLoading ? "Searching" : "Search API"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-slate-200 p-5 dark:border-slate-700">
              {isLoading ? (
                <Loader variant="skeleton" label="Loading backend bookings" />
              ) : apiError ? (
                <div className="text-sm font-semibold text-red-700 dark:text-red-300">{apiError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="pb-3">Guest</th>
                        <th className="pb-3">Destination</th>
                        <th className="pb-3">Check-in</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="py-3 font-semibold text-forest dark:text-emerald-100">{booking.guestName}</td>
                          <td className="py-3 text-slate-600 dark:text-slate-300">{booking.destination}</td>
                          <td className="py-3 text-slate-600 dark:text-slate-300">{booking.checkIn}</td>
                          <td className="py-3">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-forest dark:bg-slate-800 dark:text-emerald-100">
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-semibold text-slate-700 dark:text-slate-200">
                            Rs. {booking.totalAmount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              <Button variant="primary" size="sm" onClick={handleGeneratePlan}>
                AI plan
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
      <Toast show={showToast} message={toastMessage} type={apiError ? "info" : "success"} onDismiss={() => setShowToast(false)} />
    </div>
  );
}

export default Dashboard;
