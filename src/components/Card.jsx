import React from "react";

function Card({ title, description, value }) {
  return (
    <article className="h-full rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      {value && <p className="mb-3 text-3xl font-bold text-forest">{value}</p>}
      <h3 className="text-xl font-semibold text-forest">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
    </article>
  );
}

export default Card;
