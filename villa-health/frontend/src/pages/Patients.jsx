import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data.patients);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this patient account?")) return;
    try {
      await api.patch(`/patients/${id}/deactivate`);
      loadPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Could not deactivate patient");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-clinic-900 mb-1">Patients</h2>
      <p className="text-clinic-500 text-sm mb-6">Everyone registered as a patient on Villa Health.</p>

      {error && <div className="text-sm text-clay bg-clay/10 rounded-lg px-3 py-2 mb-4">{error}</div>}

      {loading ? (
        <p className="text-clinic-500 text-sm">Loading patients...</p>
      ) : patients.length === 0 ? (
        <p className="text-clinic-500 text-sm">No patients registered yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-clinic-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-clinic-50 text-clinic-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id} className="border-t border-clinic-100">
                  <td className="px-4 py-3">{p.user?.name}</td>
                  <td className="px-4 py-3 text-clinic-600">{p.user?.email}</td>
                  <td className="px-4 py-3 text-clinic-600">{p.user?.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        p.user?.isActive ? "bg-clinic-100 text-clinic-700" : "bg-clay/10 text-clay"
                      }`}
                    >
                      {p.user?.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.user?.isActive && (
                      <button
                        onClick={() => handleDeactivate(p._id)}
                        className="text-xs text-clay hover:underline"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
