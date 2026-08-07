import React, { useMemo, useState } from "react";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { Button, Input, Loader, Toast } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const tools = {
  itinerary: {
    label: "Itinerary Planner",
    endpoint: "/ai/itinerary",
    description: "Create a day-wise eco-friendly travel plan for guests.",
    initial: {
      destination: "Manali",
      nights: "3",
      budget: "Rs. 10000",
      travelStyle: "eco-friendly family trip with local food and nature walks"
    },
    fields: [
      { name: "destination", label: "Destination", placeholder: "Manali" },
      { name: "nights", label: "Nights", type: "number", min: "1", max: "30" },
      { name: "budget", label: "Budget", placeholder: "Rs. 10000" },
      { name: "travelStyle", label: "Travel style", textarea: true, placeholder: "Eco-friendly family trip..." }
    ]
  },
  listing: {
    label: "Listing Writer",
    endpoint: "/ai/listing-description",
    description: "Generate a polished homestay listing title and description.",
    initial: {
      propertyName: "Pine View Eco Homestay",
      location: "Rishikesh",
      amenities: "river view, WiFi, local breakfast, guided walks",
      targetGuests: "backpackers and couples",
      ecoFeatures: "solar lights, refill water station, local organic meals"
    },
    fields: [
      { name: "propertyName", label: "Property name" },
      { name: "location", label: "Location" },
      { name: "amenities", label: "Amenities", textarea: true },
      { name: "targetGuests", label: "Target guests" },
      { name: "ecoFeatures", label: "Eco features", textarea: true }
    ]
  },
  review: {
    label: "Review Insights",
    endpoint: "/ai/review-insights",
    description: "Analyze guest feedback and suggest owner actions.",
    initial: {
      reviewText:
        "The location was peaceful and the host was helpful, but the room could have been cleaner and the WiFi was slow in the evening."
    },
    fields: [
      { name: "reviewText", label: "Guest review", textarea: true, rows: 8 }
    ]
  }
};

function TextAreaField({ field, value, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
      {field.label}
      <textarea
        name={field.name}
        value={value}
        rows={field.rows || 4}
        onChange={onChange}
        placeholder={field.placeholder}
        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-leaf focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-emerald-950"
        required
      />
    </label>
  );
}

function AIAssistant() {
  const [activeTool, setActiveTool] = useState("itinerary");
  const [forms, setForms] = useState(() => Object.fromEntries(Object.entries(tools).map(([key, tool]) => [key, tool.initial])));
  const [results, setResults] = useState({});
  const [loadingTool, setLoadingTool] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const { token, logout } = useAuth();

  const currentTool = tools[activeTool];
  const currentForm = forms[activeTool];
  const result = results[activeTool];

  const examples = useMemo(
    () => [
      { title: "Eco trip plan", text: "Day-wise itinerary, budget tips, local food, low-impact travel ideas." },
      { title: "Listing copy", text: "Owner-friendly title, description, and stay highlights." },
      { title: "Review response", text: "Sentiment, issues, improvement actions, and a polite reply." }
    ],
    []
  );

  function updateField(event) {
    const { name, value } = event.target;
    setForms((current) => ({
      ...current,
      [activeTool]: { ...current[activeTool], [name]: value }
    }));
  }

  async function submitTool(event) {
    event.preventDefault();
    setLoadingTool(activeTool);
    setResults((current) => ({ ...current, [activeTool]: "" }));
    try {
      const response = await fetch(`${API_URL}${currentTool.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentForm)
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        logout();
        throw new Error("Session expired. Please login again.");
      }
      if (!response.ok) throw new Error(data.error || data.errors?.join(", ") || "AI request failed");
      setResults((current) => ({ ...current, [activeTool]: data.result }));
      setToast({ show: true, message: "AI response generated successfully." });
    } catch (error) {
      setToast({ show: true, message: error.message });
    } finally {
      setLoadingTool("");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">AI Workspace</p>
            <h1 className="mt-3 text-4xl font-bold text-forest dark:text-emerald-100">A better first draft, faster.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
              Generate travel plans, listing copy, and guest review insights using a backend Groq API service.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {examples.map((item) => (
                <div key={item.title} className="rounded-lg border border-emerald-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="font-bold text-forest dark:text-emerald-100">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-emerald-100 bg-emerald-50/60 p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
            <div className="grid gap-2 rounded-lg bg-emerald-50 p-2 dark:bg-slate-950 sm:grid-cols-3">
              {Object.entries(tools).map(([key, tool]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTool(key)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    activeTool === key
                      ? "bg-forest text-white dark:bg-leaf dark:text-slate-950"
                      : "text-forest hover:bg-white dark:text-emerald-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
            </div>

            <div className="p-5 sm:p-6">
            <div>
              <h2 className="text-2xl font-bold text-forest dark:text-emerald-100">{currentTool.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{currentTool.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Private, authenticated AI request</p>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={submitTool}>
              {currentTool.fields.map((field) =>
                field.textarea ? (
                  <TextAreaField key={field.name} field={field} value={currentForm[field.name]} onChange={updateField} />
                ) : (
                  <Input
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    value={currentForm[field.name]}
                    onChange={updateField}
                    required
                  />
                )
              )}
              <Button type="submit" disabled={Boolean(loadingTool)}>
                {loadingTool === activeTool ? "Generating" : `Generate ${currentTool.label}`}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50/50 p-5 dark:border-slate-700 dark:bg-slate-950">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-leaf dark:text-emerald-300">AI output</h3>
              <div className="mt-4 min-h-32 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
                {loadingTool === activeTool ? <Loader label="Generating AI response" /> : result || "Your AI-generated result will appear here."}
              </div>
            </div>
            </div>
          </section>
        </section>
      </main>
      <Footer />
      <Toast show={toast.show} message={toast.message} type="info" onDismiss={() => setToast({ show: false, message: "" })} />
    </div>
  );
}

export default AIAssistant;
