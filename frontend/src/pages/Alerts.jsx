import { useState, useEffect } from "react";

const INITIAL_ALERTS = [
  { id: 1, type: "critical", icon: "🔴", title: "Battery Critical — Deep Space Relay", desc: "Battery level dropped to 15%. Immediate attention required.", mission: "Deep Space Relay", time: "00:02:14", condition: "battery < 20", active: true },
  { id: 2, type: "critical", icon: "🔴", title: "Signal Lost — Deep Space Relay", desc: "Communication signal classified as Weak. Data transmission degraded.", mission: "Deep Space Relay", time: "00:05:30", condition: "signal === Weak", active: true },
  { id: 3, type: "warning", icon: "🟡", title: "High Temperature — Mars Explorer I", desc: "Surface temperature reading 45°C — approaching thermal threshold.", mission: "Mars Explorer I", time: "00:12:07", condition: "temperature > 40", active: true },
  { id: 4, type: "warning", icon: "🟡", title: "Battery Moderate — Titan Probe", desc: "Battery at 67%. Monitor closely for further degradation.", mission: "Titan Probe", time: "00:18:45", condition: "battery < 70", active: true },
  { id: 5, type: "info", icon: "🔵", title: "Telemetry Sync Complete — Lunar Gateway II", desc: "All telemetry channels synchronized. Systems nominal.", mission: "Lunar Gateway II", time: "00:25:00", condition: "system check", active: true },
  { id: 6, type: "info", icon: "🔵", title: "Orbit Correction — Mars Explorer I", desc: "Scheduled orbital correction maneuver completed successfully.", mission: "Mars Explorer I", time: "00:31:20", condition: "orbit maneuver", active: true },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState("All");
  const [dismissed, setDismissed] = useState([]);

  const dismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setDismissed((prev) => [...prev, id]);
  };

  const dismissAll = () => {
    setAlerts([]);
  };

  const filtered = filter === "All" ? alerts : alerts.filter((a) => a.type === filter.toLowerCase());
  const criticalCount = alerts.filter((a) => a.type === "critical").length;
  const warningCount = alerts.filter((a) => a.type === "warning").length;
  const infoCount = alerts.filter((a) => a.type === "info").length;

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">⚠️ Alerts & Notifications</h2>
        <p className="page-subtitle">Mission-critical alerts, warnings, and system notifications</p>
      </div>

      {/* Alert summary cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 28 }}>
        <div className="stat-card failed" style={{ textAlign: "center" }}>
          <div className="stat-icon">🚨</div>
          <div className="stat-value">{criticalCount}</div>
          <div className="stat-label">Critical Alerts</div>
        </div>
        <div className="stat-card planned" style={{ textAlign: "center" }}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{warningCount}</div>
          <div className="stat-label">Warnings</div>
        </div>
        <div className="stat-card total" style={{ textAlign: "center" }}>
          <div className="stat-icon">ℹ️</div>
          <div className="stat-value">{infoCount}</div>
          <div className="stat-label">Info</div>
        </div>
        <div className="stat-card active" style={{ textAlign: "center" }}>
          <div className="stat-icon">✅</div>
          <div className="stat-value">{dismissed.length}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Critical", "Warning", "Info"].map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setFilter(f)}
            >
              {f} {f === "All" ? `(${alerts.length})` : ""}
            </button>
          ))}
        </div>
        {alerts.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={dismissAll}>
            Clear All
          </button>
        )}
      </div>

      {/* Alerts list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>No alerts</h3>
          <p>All systems are operating nominally</p>
        </div>
      ) : (
        <div>
          {filtered.map((alert) => (
            <div key={alert.id} className={`alert-item alert-${alert.type}`}>
              <div className="alert-icon">{alert.icon}</div>
              <div className="alert-content">
                <div className="alert-title">{alert.title}</div>
                <div className="alert-desc">{alert.desc}</div>
                <div style={{ marginTop: 6, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    🚀 {alert.mission}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Orbitron, sans-serif" }}>
                    T+{alert.time}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    Condition: <code style={{ background: "rgba(0,0,0,0.3)", padding: "1px 6px", borderRadius: 4 }}>{alert.condition}</code>
                  </span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => dismiss(alert.id)}
                style={{ flexShrink: 0 }}
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Alert logic display */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">⚡ Alert Logic Reference</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Condition</th>
                <th>Severity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { condition: "battery < 20%", severity: "🔴 Critical", action: "Immediate power conservation protocol" },
                { condition: "battery < 50%", severity: "🟡 Warning", action: "Monitor and prepare backup systems" },
                { condition: 'signal === "Lost"', severity: "🔴 Critical", action: "Activate redundant comms array" },
                { condition: 'signal === "Weak"', severity: "🟡 Warning", action: "Increase antenna gain, check trajectory" },
                { condition: "temperature > 80°C", severity: "🔴 Critical", action: "Thermal shutdown of non-essential systems" },
                { condition: "temperature > 50°C", severity: "🟡 Warning", action: "Activate cooling systems" },
                { condition: "All systems nominal", severity: "🟢 Info", action: "Log and continue monitoring" },
              ].map((row, i) => (
                <tr key={i}>
                  <td><code style={{ background: "rgba(0,212,255,0.08)", padding: "2px 8px", borderRadius: 4, color: "var(--accent-cyan)", fontSize: "0.82rem" }}>{row.condition}</code></td>
                  <td>{row.severity}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
