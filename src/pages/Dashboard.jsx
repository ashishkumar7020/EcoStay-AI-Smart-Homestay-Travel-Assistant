import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, Loader, Modal, Toast } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const emptyForm = {
  guestName: "",
  destination: "",
  checkIn: "",
  nights: "1",
  status: "pending",
  sustainabilityScore: "80",
  totalAmount: ""
};

function Dashboard() {
  const { token, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [apiError, setApiError] = useState("");

  function notify(message, type = "success") {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  }

  async function loadDashboardData(query = "") {
    setIsLoading(true);
    setApiError("");
    try {
      const endpoint = query.trim()
        ? `${API_URL}/bookings/search?q=${encodeURIComponent(query.trim())}`
        : `${API_URL}/bookings`;
      const requestOptions = { cache: "no-store", headers: { Authorization: `Bearer ${token}` } };
      const [bookingsResponse, statsResponse] = await Promise.all([fetch(endpoint, requestOptions), fetch(`${API_URL}/bookings/stats`, requestOptions)]);
      if (bookingsResponse.status === 401 || statsResponse.status === 401) {
        logout();
        throw new Error("Your session expired. Please login again.");
      }
      if (!bookingsResponse.ok || !statsResponse.ok) throw new Error("Could not load booking data");
      const [bookingsJson, statsJson] = await Promise.all([bookingsResponse.json(), statsResponse.json()]);
      setBookings(bookingsJson.data);
      setApiStats(statsJson.data);
    } catch (error) {
      setApiError(error.message);
      notify("Backend database is unavailable. Check the API connection.", "info");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  const stats = useMemo(
    () => [
      { title: "Live Bookings", value: apiStats ? String(apiStats.totalBookings) : "--", description: "Persistent reservations stored in MongoDB Atlas." },
      { title: "Confirmed Stays", value: apiStats ? String(apiStats.confirmedBookings) : "--", description: "Confirmed reservations currently in the database." },
      { title: "Eco Score", value: apiStats ? `${apiStats.averageSustainabilityScore}/100` : "--", description: "Average sustainability score across all bookings." }
    ],
    [apiStats]
  );

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(booking) {
    setEditingId(booking.id);
    setForm({
      guestName: booking.guestName,
      destination: booking.destination,
      checkIn: booking.checkIn,
      nights: String(booking.nights),
      status: booking.status,
      sustainabilityScore: String(booking.sustainabilityScore),
      totalAmount: String(booking.totalAmount)
    });
    setIsModalOpen(true);
  }

  function handleFormChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    const errors = [];
    if (form.guestName.trim().length < 2) errors.push("Guest name must contain at least 2 characters.");
    if (form.destination.trim().length < 2) errors.push("Destination must contain at least 2 characters.");
    if (!form.checkIn) errors.push("Choose a check-in date.");
    if (Number(form.nights) < 1 || Number(form.nights) > 365) errors.push("Nights must be between 1 and 365.");
    if (Number(form.sustainabilityScore) < 0 || Number(form.sustainabilityScore) > 100) errors.push("Eco score must be between 0 and 100.");
    if (form.totalAmount === "" || Number(form.totalAmount) < 0) errors.push("Enter a valid total amount.");
    if (errors.length) {
      notify(errors[0], "info");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/bookings${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (response.status === 401) {
        logout();
        throw new Error("Your session expired. Please login again.");
      }
      const result = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(result?.errors?.join(", ") || result?.error || "Could not save booking");
      setIsModalOpen(false);
      notify(editingId ? "Booking updated successfully." : "Booking created successfully.");
      await loadDashboardData(searchQuery);
    } catch (error) {
      notify(error.message, "info");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(booking) {
    if (!window.confirm(`Delete ${booking.guestName}'s booking?`)) return;
    try {
      const response = await fetch(`${API_URL}/bookings/${booking.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 401) {
        logout();
        throw new Error("Your session expired. Please login again.");
      }
      if (!response.ok) throw new Error("Could not delete booking");
      notify("Booking deleted successfully.");
      await loadDashboardData(searchQuery);
    } catch (error) {
      notify(error.message, "info");
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    loadDashboardData(searchQuery);
  }

  const statusClass = {
    confirmed: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    pending: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    cancelled: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-lg border border-emerald-100 bg-white px-5 py-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-8 sm:py-9">
          <div className="absolute right-0 top-0 h-28 w-28 bg-emerald-50 dark:bg-emerald-950/60" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Owner workspace</p>
            <h1 className="mt-3 text-4xl font-bold text-forest dark:text-emerald-100">Business Dashboard</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300">
              Create, review, update, and delete reservations stored persistently in MongoDB Atlas.
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 sm:mt-8">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400"><span className="h-2 w-2 rounded-full bg-leaf" />Live data connected</p>
            <Button onClick={openCreateModal}>Add booking</Button>
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => <Card key={stat.title} {...stat} accent={["emerald", "sky", "amber"][index]} />)}
        </section>

        <section className="mt-8 overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="p-5 pb-0 sm:p-6 sm:pb-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Reservations</p>
              <h2 className="mt-2 text-2xl font-bold text-forest dark:text-emerald-100">Booking records</h2>
            </div>
            <form className="flex w-full gap-2 px-5 sm:max-w-md sm:px-6" onSubmit={handleSearch}>
              <div className="flex-1">
                <Input
                  label="Search bookings"
                  placeholder="Guest, destination, status"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  error={searchQuery.length === 1 ? "Enter at least 2 characters." : ""}
                />
              </div>
              <div className="pt-7">
                <Button type="submit" disabled={isLoading || searchQuery.length === 1}>Search</Button>
              </div>
            </form>
          </div>

          <div className="mt-6 border-t border-emerald-100 p-5 dark:border-slate-800 sm:p-6">
            {isLoading ? (
              <Loader variant="skeleton" label="Loading bookings" />
            ) : apiError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"><p>Unable to refresh bookings</p><p className="mt-1 font-normal">{apiError}</p><Button className="mt-4" size="sm" variant="outline" onClick={() => loadDashboardData(searchQuery)}>Try again</Button></div>
            ) : bookings.length === 0 ? (
              <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
                <h3 className="font-bold text-forest dark:text-emerald-100">No bookings yet</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Add your first reservation to start tracking stays and eco scores.</p>
                <Button className="mt-4" onClick={openCreateModal}>Add booking</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="bg-emerald-50/70 text-xs uppercase tracking-[0.08em] text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Guest</th><th className="px-4 py-3">Destination</th><th className="px-4 py-3">Check-in</th>
                      <th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Revenue</th><th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="transition hover:bg-emerald-50/50 dark:hover:bg-slate-950">
                        <td className="px-4 py-4 font-semibold text-forest dark:text-emerald-100">{booking.guestName}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{booking.destination}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{booking.checkIn}</td>
                        <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass[booking.status] || statusClass.pending}`}>{booking.status}</span></td>
                        <td className="px-4 py-4 text-right font-semibold text-slate-700 dark:text-slate-200">Rs. {booking.totalAmount.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEditModal(booking)}>Edit</Button>
                            <Button size="sm" variant="secondary" onClick={() => handleDelete(booking)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Update booking" : "Create booking"}>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
          <Input label="Guest name" name="guestName" value={form.guestName} onChange={handleFormChange} required />
          <Input label="Destination" name="destination" value={form.destination} onChange={handleFormChange} required />
          <Input label="Check-in date" name="checkIn" type="date" value={form.checkIn} onChange={handleFormChange} required />
          <Input label="Nights" name="nights" type="number" min="1" max="365" value={form.nights} onChange={handleFormChange} required />
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Status
            <select name="status" value={form.status} onChange={handleFormChange} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950">
              <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
            </select>
          </label>
          <Input label="Eco score" name="sustainabilityScore" type="number" min="0" max="100" value={form.sustainabilityScore} onChange={handleFormChange} required />
          <Input label="Total amount (Rs.)" name="totalAmount" type="number" min="0" value={form.totalAmount} onChange={handleFormChange} required />
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving" : editingId ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
      <Toast show={showToast} message={toastMessage} type={toastType} onDismiss={() => setShowToast(false)} />
    </div>
  );
}

export default Dashboard;
