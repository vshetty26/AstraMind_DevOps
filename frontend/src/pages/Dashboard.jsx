import { useState, useEffect } from "react";
import { getStats, getMissions } from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, failed: 0, planned: 0 });
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, m] = await Promise.all([getStats(), getMissions()]);
        setStats(s.data);
        setMissions(m.data.slice(0, 5));
      } catch {
        setError("Backend offline — showing demo data");
        setStats({ total: 12, active: 8, completed: 3, failed: 1, planned: 0 });
        setMissions([
          { _id: "1", name: "Mars Explorer I", planet: "Mars", status: "Active", launchDate: "2026-06-15" },
          { _id: "2", name: "Titan Probe", planet: "Saturn", status: "Active", launchDate: "2026-08-20" },
          { _id: "3", name: "Europa Discovery", planet: "Jupiter", status: "Completed", launchDate: "2025-03-10" },
          { _id: "4", name: "Venus Survey", planet: "Venus", status: "Failed", launchDate: "2025-11-05" },
          { _id: "5", name: "Lunar Gateway II", planet: "Moon", status: "Planned", launchDate: "2027-01-01" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusBadge = (s) => {
    const cls = { Active: "badge-active", Completed: "badge-completed", Failed: "badge-failed", Planned: "badge-planned" };
    const dots = { Active: "🟢", Completed: "🟣", Failed: "🔴", Planned: "🟡" };
    return <span className={`badge ${cls[s]}`}>{dots[s]} {s}</span>;
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p style={{ color: "var(--text-muted)", letterSpacing: 2 }}>INITIALIZING MISSION CONTROL...</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">🛸 Mission Control Dashboard</h2>
        <p className="page-subtitle">
          {error
            ? `⚠ ${error}`
            : "Real-time overview of all interplanetary missions"}
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { cls: "total", icon: "🌌", value: stats.total, label: "Total Missions" },
          { cls: "active", icon: "⚡", value: stats.active, label: "Active Missions" },
          { cls: "completed", icon: "✅", value: stats.completed, label: "Completed" },
          { cls: "failed", icon: "💥", value: stats.failed, label: "Failed" },
          { cls: "planned", icon: "📋", value: stats.planned, label: "Planned" },
        ].map((s) => (
          <div key={s.cls} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Missions */}
        <div className="card">
          <div className="card-title">🚀 Recent Missions</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Planet</th>
                  <th>Status</th>
                  <th>Launch</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((m) => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                    <td style={{ color: "var(--accent-cyan)" }}>{m.planet}</td>
                    <td>{statusBadge(m.status)}</td>
                    <td style={{ color: "var(--text-muted)", fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem" }}>{m.launchDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to="/missions">
              <button className="btn btn-secondary btn-sm">View All Missions →</button>
            </Link>
          </div>
        </div>

        {/* Quick Status */}
        <div className="card">
          <div className="card-title">📡 System Status</div>
          {[
            { label: "Mission Success Rate", value: stats.total ? Math.round((stats.completed / stats.total) * 100) : 0, cls: "green" },
            { label: "Active Mission Load", value: stats.total ? Math.round((stats.active / stats.total) * 100) : 0, cls: "" },
            { label: "Network Uptime", value: 99, cls: "green" },
            { label: "Telemetry Signal Strength", value: 87, cls: "" },
            { label: "Alert Severity", value: 24, cls: "red" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{item.label}</span>
                <span style={{ fontSize: "0.82rem", fontFamily: "Orbitron, sans-serif", color: "var(--accent-cyan)" }}>{item.value}%</span>
              </div>
              <div className="progress-bar-wrapper">
                <div className={`progress-bar ${item.cls}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="card">
        <div className="card-title">⚡ Quick Actions</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/missions"><button className="btn btn-primary">🚀 Add Mission</button></Link>
          <Link to="/telemetry"><button className="btn btn-secondary">📡 View Telemetry</button></Link>
          <Link to="/alerts"><button className="btn btn-secondary">⚠️ Check Alerts</button></Link>
          <Link to="/analytics"><button className="btn btn-secondary">📊 Analytics</button></Link>
        </div>
      </div>
    </>
  );
}
