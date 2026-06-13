import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: "🛸", label: "Dashboard" },
  { to: "/missions", icon: "🚀", label: "Missions" },
  { to: "/telemetry", icon: "📡", label: "Telemetry" },
  { to: "/alerts", icon: "⚠️", label: "Alerts" },
  { to: "/analytics", icon: "📊", label: "Analytics" },
];

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time.toUTCString().slice(17, 25) + " UTC";
}

const pageTitles = {
  "/": "MISSION CONTROL",
  "/missions": "MISSIONS",
  "/telemetry": "TELEMETRY",
  "/alerts": "ALERTS",
  "/analytics": "ANALYTICS",
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "ASTRAMIND";

  return (
    <div className="app-layout">
      {/* Orbit decoration */}
      <div className="orbit-bg" />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>ASTRAMIND</h1>
          <p>Mission Control v1.0</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-status">
          <div className="status-indicator">
            <div className="status-dot" />
            System Online
          </div>
          <div style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Deep Space Network: Active
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-right">
            <span className="topbar-time">
              <Clock />
            </span>
            <span className="topbar-badge">MISSION CONTROL</span>
          </div>
        </header>

        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
