import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/",          icon: "◈", label: "Dashboard"  },
  { to: "/missions",  icon: "◎", label: "Missions"   },
  { to: "/telemetry", icon: "◉", label: "Telemetry"  },
  { to: "/alerts",    icon: "◬", label: "Alerts"     },
  { to: "/analytics", icon: "◫", label: "Analytics"  },
];

function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(t.getDate())} ${t.toLocaleString("en",{month:"short"}).toUpperCase()} ${t.getFullYear()} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
}

const PAGE_TITLES = {
  "/":          { label: "MISSION CONTROL", sub: "DASHBOARD" },
  "/missions":  { label: "MISSIONS",        sub: "REGISTRY"  },
  "/telemetry": { label: "TELEMETRY",       sub: "LIVE FEED" },
  "/alerts":    { label: "ALERTS",          sub: "SYSTEM"    },
  "/analytics": { label: "ANALYTICS",       sub: "INSIGHTS"  },
};

export default function Layout() {
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { label: "ASTRAMIND", sub: "" };

  return (
    <div className="app-layout">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>ASTRAMIND</h1>
          <p>Mission Control</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <span className="nav-icon" style={{ fontStyle: "normal" }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-status">
          <div className="status-row">
            <div className="status-dot" />
            <span className="status-label">NOMINAL</span>
          </div>
          <div style={{ marginTop: 6, fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1 }}>
            DSN LINK ACTIVE
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-status-label">SYSTEM STATUS:</span>
            <span className="topbar-status-value">NOMINAL</span>
            <div className="topbar-sep" />
            <span className="topbar-status-label">{page.sub}</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-time"><LiveClock /></span>
            <span className="topbar-badge">MISSION CTRL</span>
          </div>
        </header>

        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
