import React from "react";

function Card({ title, description, value, accent = "emerald" }) {
  const accents = {
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    amber: "bg-amber-500"
  };

  return (
    <article className="group relative h-full overflow-hidden rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <span className={`absolute inset-x-0 top-0 h-1 ${accents[accent] || accents.emerald}`} />
      {value && <p className="mb-3 pt-1 text-3xl font-bold text-forest dark:text-emerald-100">{value}</p>}
      <h3 className="text-xl font-semibold text-forest dark:text-emerald-100">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  );
}

export default Card;
