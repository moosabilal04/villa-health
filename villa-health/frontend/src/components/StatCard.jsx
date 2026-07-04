import React from "react";

export default function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        accent ? "bg-clinic-600 border-clinic-600 text-white" : "bg-white border-clinic-100 text-clinic-900"
      }`}
    >
      <p className={`text-sm ${accent ? "text-clinic-100" : "text-clinic-500"}`}>{label}</p>
      <p className="font-display text-3xl mt-2">{value}</p>
    </div>
  );
}
