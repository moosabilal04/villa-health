import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ patients: 0, specialists: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const requests = [api.get("/specialists"), api.get("/appointments")];
        if (user?.role === "admin") requests.unshift(api.get("/patients"));

        const results = await Promise.all(requests);

        if (user?.role === "admin") {
          const [patientsRes, specialistsRes, appointmentsRes] = results;
          setCounts({
            patients: patientsRes.data.patients.length,
            specialists: specialistsRes.data.specialists.length,
            appointments: appointmentsRes.data.appointments.length,
          });
        } else {
          const [specialistsRes, appointmentsRes] = results;
          setCounts((c) => ({
            ...c,
            specialists: specialistsRes.data.specialists.length,
            appointments: appointmentsRes.data.appointments.length,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div>
      <h2 className="font-display text-2xl text-clinic-900 mb-1">
        Welcome back, {user?.name?.split(" ")[0]}
      </h2>
      <p className="text-clinic-500 text-sm mb-8">Here's what's happening at Villa Health today.</p>

      {loading ? (
        <p className="text-clinic-500 text-sm">Loading overview...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {user?.role === "admin" && (
            <StatCard label="Registered patients" value={counts.patients} accent />
          )}
          <StatCard label="Specialists on platform" value={counts.specialists} />
          <StatCard label="Total appointments" value={counts.appointments} />
        </div>
      )}
    </div>
  );
}
