import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Specialists() {
  const { user } = useAuth();
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSpecialists = async () => {
    try {
      const res = await api.get("/specialists");
      setSpecialists(res.data.specialists);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load specialists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialists();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/specialists/${id}/approve`);
      loadSpecialists();
    } catch (err) {
      setError(err.response?.data?.message || "Could not approve specialist");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-clinic-900 mb-1">Specialists</h2>
      <p className="text-clinic-500 text-sm mb-6">Health specialists offering consultations on the platform.</p>

      {error && <div className="text-sm text-clay bg-clay/10 rounded-lg px-3 py-2 mb-4">{error}</div>}

      {loading ? (
        <p className="text-clinic-500 text-sm">Loading specialists...</p>
      ) : specialists.length === 0 ? (
        <p className="text-clinic-500 text-sm">No specialists yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialists.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl border border-clinic-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-clinic-900">{s.user?.name}</p>
                  <p className="text-sm text-clinic-500">{s.specialty}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    s.isApproved ? "bg-clinic-100 text-clinic-700" : "bg-clay/10 text-clay"
                  }`}
                >
                  {s.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-clinic-600 mt-3">{s.bio || "No bio provided yet."}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-clinic-700 font-medium">€{s.consultationFee}/visit</span>
                {user?.role === "admin" && !s.isApproved && (
                  <button
                    onClick={() => handleApprove(s._id)}
                    className="text-xs bg-clinic-600 text-white px-3 py-1.5 rounded-lg hover:bg-clinic-700"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
