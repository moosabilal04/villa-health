import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/patients", label: "Patients" },
  { to: "/specialists", label: "Specialists" },
  { to: "/appointments", label: "Appointments" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-sand">
      <aside className="w-60 shrink-0 bg-clinic-800 text-clinic-50 flex flex-col">
        <div className="px-6 py-6 border-b border-clinic-700">
          <h1 className="font-display text-lg">Villa Health</h1>
          <p className="text-xs text-clinic-300">Admin console</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? "bg-clinic-600 text-white" : "text-clinic-200 hover:bg-clinic-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-clinic-700">
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-clinic-300 capitalize mb-3">{user?.role}</p>
          <button
            onClick={logout}
            className="text-xs text-clinic-200 hover:text-white underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
