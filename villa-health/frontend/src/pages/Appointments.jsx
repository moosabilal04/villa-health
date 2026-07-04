import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const statusStyles = {
  pending: "bg-clay/10 text-clay",
  confirmed: "bg-clinic-100 text-clinic-700",
  completed: "bg-clinic-600 text-white",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data.appointments);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update appointment");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-clinic-900 mb-1">Appointments</h2>
      <p className="text-clinic-500 text-sm mb-6">All bookings between patients and specialists.</p>

      {error && <div className="text-sm text-clay bg-clay/10 rounded-lg px-3 py-2 mb-4">{error}</div>}

      {loading ? (
        <p className="text-clinic-500 text-sm">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-clinic-500 text-sm">No appointments booked yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-clinic-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-clinic-50 text-clinic-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Specialist</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {(user?.role === "admin" || user?.role === "specialist") && (
                  <th className="px-4 py-3 font-medium"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-t border-clinic-100">
                  <td className="px-4 py-3">{a.patient?.user?.name}</td>
                  <td className="px-4 py-3">{a.specialist?.user?.name}</td>
                  <td className="px-4 py-3 text-clinic-600">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-clinic-600">
                    {a.startTime} - {a.endTime}
                  </td>
                  <td className="px-4 py-3 text-clinic-600">
                    €{a.payment?.amount} · {a.payment?.status}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  {(user?.role === "admin" || user?.role === "specialist") && (
                    <td className="px-4 py-3 text-right">
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                        className="text-xs border border-clinic-200 rounded-lg px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
