import { useState, useEffect } from "react";

const MISSIONS_TELEMETRY = [
  {
    id: 1,
    mission: "Mars Explorer I",
    planet: "Mars",
    battery: 89,
    signal: "Strong",
    temperature: 45,
    pressure: 0.636,
    altitude: 1200,
    velocity: 3600,
    distance: 225000000,
    status: "Active",
  },
  {
    id: 2,
    mission: "Titan Probe",
    planet: "Saturn / Titan",
    battery: 67,
    signal: "Moderate",
    temperature: -179,
    pressure: 1.47,
    altitude: 50000,
    velocity: 5900,
    distance: 1270000000,
    status: "Active",
  },
  {
    id: 3,
    mission: "Lunar Gateway II",
    planet: "Moon",
    battery: 95,
    signal: "Strong",
    temperature: 107,
    pressure: 0,
    altitude: 400000,
    velocity: 1022,
    distance: 384400,
    status: "Active",
  },
  {
    id: 4,
    mission: "Deep Space Relay",
    planet: "Asteroid Belt",
    battery: 15,
    signal: "Weak",
    temperature: -80,
    pressure: 0,
    altitude: 0,
    velocity: 18000,
    distance: 450000000,
    status: "Warning",
  },
];

function getBatteryColor(val) {
  if (val >= 70) return "var(--accent-green)";
  if (val >= 30) return "var(--accent-yellow)";
  return "var(--accent-red)";
}

function getSignalColor(s) {
  if (s === "Strong") return "var(--accent-green)";
  if (s === "Moderate") return "var(--accent-yellow)";
  return "var(--accent-red)";
}

export default function Telemetry() {
  const [selected, setSelected] = useState(MISSIONS_TELEMETRY[0]);
  const [live, setLive] = useState(selected);
  const [tick, setTick] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setLive((prev) => ({
        ...prev,
        battery: Math.max(0, Math.min(100, prev.battery + (Math.random() - 0.5) * 2)),
        temperature: prev.temperature + (Math.random() - 0.5) * 3,
        velocity: Math.round(prev.velocity + (Math.random() - 0.5) * 100),
        altitude: Math.round(prev.altitude + (Math.random() - 0.5) * 50),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [selected]);

  useEffect(() => {
    setLive({ ...selected });
  }, [selected]);

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">📡 Telemetry Center</h2>
        <p className="page-subtitle">Live telemetry data from active deep-space missions</p>
      </div>

      {/* Mission selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {MISSIONS_TELEMETRY.map((m) => (
          <button
            key={m.id}
            className={`btn ${selected.id === m.id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setSelected(m)}
          >
            {m.status === "Warning" ? "⚠️" : "🚀"} {m.mission}
          </button>
        ))}
      </div>

      {/* Live indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div className="status-dot" style={{ width: 10, height: 10 }} />
        <span style={{ fontSize: "0.78rem", color: "var(--accent-green)", fontFamily: "Orbitron, sans-serif", letterSpacing: 1 }}>
          LIVE — {live.mission} · {live.planet}
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 8 }}>
          Updates every 3s · Tick #{tick}
        </span>
      </div>

      {/* Telemetry cards */}
      <div className="telemetry-grid">
        <div className="telemetry-card">
          <div className="telemetry-icon">🔋</div>
          <div className="telemetry-value" style={{ color: getBatteryColor(live.battery) }}>
            {live.battery.toFixed(1)}%
          </div>
          <div className="telemetry-label">Battery Level</div>
          <div className="progress-bar-wrapper" style={{ marginTop: 12 }}>
            <div
              className="progress-bar"
              style={{
                width: `${live.battery}%`,
                background: live.battery >= 70 ? "var(--gradient-success)" : live.battery >= 30 ? "linear-gradient(135deg,#ffd700,#ff6b35)" : "var(--gradient-danger)",
              }}
            />
          </div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-icon">📶</div>
          <div className="telemetry-value" style={{ color: getSignalColor(live.signal) }}>
            {live.signal}
          </div>
          <div className="telemetry-label">Signal Strength</div>
          <div className="telemetry-mission" style={{ color: getSignalColor(live.signal) }}>
            {live.signal === "Strong" ? "● ● ● ●" : live.signal === "Moderate" ? "● ● ● ○" : "● ● ○ ○"}
          </div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-icon">🌡️</div>
          <div className="telemetry-value" style={{ color: live.temperature > 50 ? "var(--accent-red)" : "var(--accent-cyan)" }}>
            {live.temperature.toFixed(1)}°C
          </div>
          <div className="telemetry-label">Temperature</div>
          <div className="telemetry-mission" style={{ color: "var(--text-muted)" }}>Surface reading</div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-icon">🚀</div>
          <div className="telemetry-value">{live.velocity.toLocaleString()}</div>
          <div className="telemetry-label">Velocity (km/h)</div>
          <div className="telemetry-mission">Relative to target</div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-icon">⬆️</div>
          <div className="telemetry-value">{live.altitude.toLocaleString()}</div>
          <div className="telemetry-label">Altitude (km)</div>
          <div className="telemetry-mission">Above surface</div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-icon">🌍</div>
          <div className="telemetry-value" style={{ fontSize: "1.4rem" }}>{(live.distance / 1e6).toFixed(1)}M</div>
          <div className="telemetry-label">Distance from Earth (km)</div>
          <div className="telemetry-mission">{live.planet}</div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-icon">🧪</div>
          <div className="telemetry-value">{live.pressure}</div>
          <div className="telemetry-label">Atmospheric Pressure (atm)</div>
          <div className="telemetry-mission">Surface measurement</div>
        </div>

        <div className="telemetry-card" style={{ background: live.battery < 20 || live.signal === "Weak" ? "rgba(255,51,102,0.08)" : "var(--bg-card)" }}>
          <div className="telemetry-icon">{live.status === "Warning" ? "⚠️" : "✅"}</div>
          <div className="telemetry-value" style={{ color: live.status === "Warning" ? "var(--accent-red)" : "var(--accent-green)", fontSize: "1.4rem" }}>
            {live.status === "Warning" ? "WARNING" : "NOMINAL"}
          </div>
          <div className="telemetry-label">Mission Status</div>
          <div className="telemetry-mission">All systems check</div>
        </div>
      </div>

      {/* All missions table */}
      <div className="card">
        <div className="card-title">📊 Fleet Overview</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mission</th>
                <th>Planet</th>
                <th>Battery</th>
                <th>Signal</th>
                <th>Temp (°C)</th>
                <th>Distance (km)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MISSIONS_TELEMETRY.map((m) => (
                <tr key={m.id} style={{ cursor: "pointer" }} onClick={() => setSelected(m)}>
                  <td style={{ fontWeight: 600 }}>{m.mission}</td>
                  <td style={{ color: "var(--accent-cyan)" }}>{m.planet}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, background: "var(--bg-primary)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${m.battery}%`, height: "100%", background: getBatteryColor(m.battery), borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: "0.8rem", color: getBatteryColor(m.battery) }}>{m.battery}%</span>
                    </div>
                  </td>
                  <td><span style={{ color: getSignalColor(m.signal), fontWeight: 600 }}>{m.signal}</span></td>
                  <td style={{ color: m.temperature > 50 ? "var(--accent-red)" : "var(--text-secondary)" }}>{m.temperature}°C</td>
                  <td style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>{m.distance.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${m.status === "Warning" ? "badge-failed" : "badge-active"}`}>
                      {m.status === "Warning" ? "⚠️ Warning" : "✅ Nominal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
