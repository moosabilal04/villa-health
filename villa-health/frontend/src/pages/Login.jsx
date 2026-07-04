import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-clinic-600 mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-display text-xl">V</span>
          </div>
          <h1 className="font-display text-2xl text-clinic-900">Villa Health</h1>
          <p className="text-clinic-500 text-sm mt-1">Admin console</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-clinic-100 p-6 space-y-4">
          {error && (
            <div className="text-sm text-clay bg-clay/10 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-sm text-clinic-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-clinic-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clinic-400"
              placeholder="you@villahealth.com"
            />
          </div>
          <div>
            <label className="block text-sm text-clinic-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-clinic-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clinic-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-clinic-600 hover:bg-clinic-700 text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
