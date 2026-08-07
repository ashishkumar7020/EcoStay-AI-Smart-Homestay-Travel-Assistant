import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import Navbar from "../components/Navbar.jsx";

const stays = [
  {
    name: "Pine & Stone Retreat",
    place: "Manali, Himachal Pradesh",
    type: "mountain",
    score: "94 eco score",
    detail: "Solar lighting, local breakfast, and cedar-framed valley views.",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1000&q=85"
  },
  {
    name: "Ganga Quiet House",
    place: "Rishikesh, Uttarakhand",
    type: "riverside",
    score: "91 eco score",
    detail: "A slow-living stay with refill stations and riverside walks.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85"
  },
  {
    name: "Kumaon Courtyard",
    place: "Mukteshwar, Uttarakhand",
    type: "village",
    score: "89 eco score",
    detail: "Stone rooms, community meals, and guided village trails.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85"
  },
  {
    name: "Misty Orchard House",
    place: "Coonoor, Tamil Nadu",
    type: "mountain",
    score: "96 eco score",
    detail: "Organic garden breakfasts and a low-waste stay experience.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85"
  }
];

const filters = ["all", "mountain", "riverside", "village"];

const faqs = [
  ["What can I do from this app?", "You can manage authenticated bookings on the owner dashboard and use the AI workspace for itineraries, listing copy, and review insights."],
  ["Does this discovery area make real bookings?", "No. These curated stay cards are a frontend experience layer for exploring ideas. Existing booking management remains available in the Dashboard."],
  ["How does the AI assistant help?", "It turns a destination, stay details, or guest review into a practical starting point for an owner or traveler."],
  ["Is EcoStay AI designed for mobile too?", "Yes. Navigation, filters, cards, and the FAQ are designed to stack cleanly on compact screens."]
];

function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [notice, setNotice] = useState("");

  const visibleStays = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return stays.filter((stay) => {
      const matchesFilter = activeFilter === "all" || stay.type === activeFilter;
      const haystack = `${stay.name} ${stay.place} ${stay.detail}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeFilter, query]);

  function shortlist(stayName) {
    setNotice(`${stayName} added to your local shortlist.`);
    window.setTimeout(() => setNotice(""), 3200);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main>
        <Hero />

        <section className="border-y border-emerald-100 bg-emerald-50/70 py-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-forest dark:text-emerald-100">Made for slow travel, local hosts, and better stay decisions.</p>
            <div className="flex gap-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              <span>Owner tools</span><span>Guest planning</span><span>Eco choices</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="discover-heading">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Stay inspiration</p>
              <h2 id="discover-heading" className="mt-3 text-3xl font-bold text-forest dark:text-emerald-100 sm:text-4xl">Find a stay with a smaller footprint</h2>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">A polished frontend-only discovery view for exploring the kind of experience EcoStay AI can help plan.</p>
            </div>
            <label className="w-full max-w-md">
              <span className="sr-only">Search stays</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Manali, riverside, village..." className="w-full rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-leaf focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-950" />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter stays by setting">
            {filters.map((filter) => (
              <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-950 ${activeFilter === filter ? "bg-forest text-white dark:bg-leaf dark:text-slate-950" : "border border-emerald-200 text-forest hover:bg-emerald-50 dark:border-slate-700 dark:text-emerald-100 dark:hover:bg-slate-900"}`}>
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleStays.map((stay, index) => (
              <article key={stay.name} className="rise-in group overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900" style={{ animationDelay: `${index * 70}ms` }}>
                <img src={stay.image} alt={stay.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-forest dark:text-emerald-100">{stay.name}</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stay.place}</p></div><span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-forest dark:bg-emerald-950 dark:text-emerald-100">{stay.score}</span></div>
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{stay.detail}</p>
                  <button type="button" onClick={() => shortlist(stay.name)} className="mt-5 text-sm font-bold text-forest underline decoration-emerald-300 underline-offset-4 transition hover:text-leaf dark:text-emerald-100">Save for later</button>
                </div>
              </article>
            ))}
          </div>

          {visibleStays.length === 0 && <div className="mt-8 rounded-lg border border-dashed border-emerald-200 px-6 py-12 text-center dark:border-slate-700"><h3 className="font-bold text-forest dark:text-emerald-100">No stays match that search</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try another place or choose a broader setting filter.</p><button type="button" className="mt-4 text-sm font-bold text-leaf underline" onClick={() => { setQuery(""); setActiveFilter("all"); }}>Reset discovery</button></div>}
        </section>

        <section className="bg-forest py-20 text-white dark:bg-slate-900">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">For better operations</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">A quieter way to run the guest experience.</h2></div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[ ["One place", "Bookings, guest context, and planning tools."], ["Three AI tools", "Itinerary, listing, and review assistance."], ["Built to focus", "A clean interface for repeat daily tasks."] ].map(([stat, detail]) => <div key={stat} className="border-l border-emerald-300/50 pl-4"><p className="text-lg font-bold text-emerald-100">{stat}</p><p className="mt-2 text-sm leading-6 text-slate-200">{detail}</p></div>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Guest perspective</p><h2 className="mt-3 text-3xl font-bold text-forest dark:text-emerald-100">Thoughtful touches show up in the stay.</h2><blockquote className="mt-8 border-l-4 border-leaf pl-5 text-xl leading-8 text-slate-700 dark:text-slate-200">“The experience felt simple from the first itinerary idea to the details our guests actually ask for.”<footer className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">- Sample owner feedback</footer></blockquote></div>
            <div className="rounded-lg bg-skysoft p-6 dark:bg-slate-900"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Need a starting point?</p><h3 className="mt-3 text-2xl font-bold text-forest dark:text-emerald-100">Turn a destination into an eco-conscious plan.</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Use the existing AI workspace to create a day-wise itinerary, describe a homestay, or understand guest feedback.</p><Link to="/ai-assistant" className="mt-6 inline-flex rounded-md bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:bg-leaf dark:text-slate-950">Open AI Assistant</Link></div>
          </div>
        </section>

        <section className="border-t border-emerald-100 bg-emerald-50/50 py-20 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="faq-heading">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf dark:text-emerald-300">Helpful answers</p><h2 id="faq-heading" className="mt-3 text-3xl font-bold text-forest dark:text-emerald-100">Questions, answered simply.</h2></div><div className="divide-y divide-emerald-100 rounded-lg border border-emerald-100 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">{faqs.map(([question, answer], index) => <div key={question}><button type="button" className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-bold text-forest focus:outline-none focus:ring-4 focus:ring-inset focus:ring-emerald-100 dark:text-emerald-100 dark:focus:ring-emerald-950" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><span className="text-xl text-leaf" aria-hidden="true">{openFaq === index ? "-" : "+"}</span></button>{openFaq === index && <p className="px-5 pb-5 leading-7 text-slate-600 dark:text-slate-300">{answer}</p>}</div>)}</div></div>
        </section>
      </main>
      <Footer />
      {notice && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-md bg-forest px-4 py-3 text-sm font-semibold text-white shadow-soft dark:bg-leaf dark:text-slate-950">{notice}</div>}
    </div>
  );
}

export default Home;
