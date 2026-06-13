import { useState, useEffect } from "react";
import { getStats, getMissions } from "../api";
import { Link } from "react-router-dom";

function CircularGauge({ pct, color = "#f97316", size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="gauge-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-2)" strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div className="gauge-text">
        <span className="gauge-val" style={{ color }}>{pct}%</span>
        <span className="gauge-sub">READY</span>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }) {
  return (
    <div className="countdown-unit">
      <div className="countdown-number">{String(value).padStart(3,"0")}</div>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, failed: 0, planned: 0 });
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [s, m] = await Promise.all([getStats(), getMissions()]);
        setStats(s.data);
        setMissions(m.data.slice(0, 6));
      } catch {
        setOffline(true);
        setStats({ total: 12, active: 8, completed: 3, failed: 1, planned: 0 });
        setMissions([
          { _id:"1", name:"Mars Explorer I",   planet:"Mars",    status:"Active",    launchDate:"2026-06-15" },
          { _id:"2", name:"Titan Probe",        planet:"Saturn",  status:"Active",    launchDate:"2026-08-20" },
          { _id:"3", name:"Europa Discovery",   planet:"Jupiter", status:"Completed", launchDate:"2025-03-10" },
          { _id:"4", name:"Venus Survey",       planet:"Venus",   status:"Failed",    launchDate:"2025-11-05" },
          { _id:"5", name:"Lunar Gateway II",   planet:"Moon",    status:"Planned",   launchDate:"2027-01-01" },
          { _id:"6", name:"Deep Space Relay",   planet:"Belt",    status:"Active",    launchDate:"2026-04-10" },
        ]);
      } finally { setLoading(false); }
    })();
  }, []);

  const successRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statusBadge = (s) => {
    const map = { Active:"badge-active", Completed:"badge-completed", Failed:"badge-failed", Planned:"badge-planned" };
    return <span className={`badge ${map[s]||""}`}>{s}</span>;
  };

  if (loading) return (
    <div className="loading-wrapper">
      <div className="spinner" />
      <p style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--text-muted)", letterSpacing:3 }}>
        INITIALIZING SYSTEMS...
      </p>
    </div>
  );

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="page-eyebrow">ASTRAMIND / DASHBOARD</div>
        <h1 className="page-title">Mission Control</h1>
        <p className="page-subtitle">
          {offline
            ? "⚠  Backend offline — displaying demo telemetry data"
            : "Real-time overview of all active interplanetary missions"}
        </p>
      </div>

      {/* ── TOP METRIC CARDS ── */}
      <div className="stats-grid">
        <div className="metric-card orange-grad">
          <div className="metric-header">
            <div className="metric-icon orange">◬</div>
            <span className="metric-delta up">▲ +{stats.active}</span>
          </div>
          <div className="metric-value">{stats.active}</div>
          <div className="metric-sublabel">Active Missions</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon green">◎</div>
            <span className="metric-delta up">▲ +{stats.completed}</span>
          </div>
          <div className="metric-value" style={{ color:"var(--green)" }}>{stats.completed}</div>
          <div className="metric-sublabel">Completed</div>
        </div>

        <div className="metric-card red-grad">
          <div className="metric-header">
            <div className="metric-icon red">◈</div>
            <span className="metric-delta down" style={{ color: stats.failed ? "var(--red)" : "var(--text-muted)" }}>
              {stats.failed ? `▼ ${stats.failed}` : "—"}
            </span>
          </div>
          <div className="metric-value" style={{ color:"var(--red)" }}>{stats.failed}</div>
          <div className="metric-sublabel">Failed</div>
        </div>

        <div className="metric-card blue-grad">
          <div className="metric-header">
            <div className="metric-icon blue">◫</div>
            <span className="metric-delta neutral">— {stats.planned}</span>
          </div>
          <div className="metric-value" style={{ color:"var(--blue)" }}>{stats.planned}</div>
          <div className="metric-sublabel">Planned</div>
        </div>

        <div className="metric-card purple-grad">
          <div className="metric-header">
            <div className="metric-icon purple">◉</div>
            <span className="metric-delta up">▲ {successRate}%</span>
          </div>
          <div className="metric-value" style={{ color:"var(--purple)" }}>{stats.total}</div>
          <div className="metric-sublabel">Total Missions</div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="grid-2" style={{ gap: 16 }}>

        {/* LEFT: Pipeline / Status */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* System health */}
          <div className="card">
            <div className="card-title">◉ SYSTEM HEALTH</div>
            {[
              { label:"Mission Success Rate", value: successRate, color:"green" },
              { label:"Active Mission Load",  value: stats.total ? Math.round((stats.active/stats.total)*100) : 0, color:"orange" },
              { label:"Network Uptime",       value: 99,  color:"green" },
              { label:"Telemetry Coverage",   value: 87,  color:"blue"  },
              { label:"Alert Severity Index", value: 24,  color:"red"   },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:"0.75rem", color:"var(--text-secondary)" }}>{item.label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:`var(--${item.color})` }}>
                    {item.value}%
                  </span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${item.color}`} style={{ width:`${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline at risk */}
          <div className="card">
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ color:"var(--orange)", fontSize:"0.8rem" }}>◬</span>
              <span className="card-title" style={{ marginBottom:0 }}>PIPELINE AT RISK</span>
            </div>

            {[
              { name:"Mars Explorer I",  status:"Bottleneck",  eff:28, active:8,  done:0,  effColor:"var(--red)"   },
              { name:"Titan Probe",      status:"On Track",    eff:94, active:12, done:45, effColor:"var(--green)" },
            ].map((p) => (
              <div key={p.name} className="pipeline-item">
                <div className="pipeline-header">
                  <div>
                    <div className="pipeline-name">{p.name}</div>
                    <div className="pipeline-sub" style={{ color: p.status==="On Track" ? "var(--green)" : "var(--orange)" }}>
                      {p.status}
                    </div>
                  </div>
                  <span className="pipeline-efficiency" style={{ color: p.effColor, letterSpacing:1 }}>
                    {p.eff}% EFFICIENCY ›
                  </span>
                </div>
                <div className="pipeline-stats">
                  <div className="pipeline-stat">
                    <div className="pipeline-stat-val" style={{ color:"var(--text-primary)" }}>{p.active}</div>
                    <div className="pipeline-stat-lbl">ACTIVE</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span className="pipeline-stat-lbl">PROGRESS</span>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color: p.effColor }}>{p.eff}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width:`${p.eff}%`, background: p.effColor }} />
                    </div>
                  </div>
                  <div className="pipeline-stat">
                    <div className="pipeline-stat-val" style={{ color: p.done > 0 ? "var(--green)" : "var(--red)" }}>{p.done}</div>
                    <div className="pipeline-stat-lbl">DONE</div>
                  </div>
                </div>
              </div>
            ))}

            <button
              className="btn btn-outline"
              style={{ width:"100%", justifyContent:"center", marginTop:4 }}
              onClick={() => location.reload()}
            >
              ↻ REFRESH DATA
            </button>
          </div>
        </div>

        {/* RIGHT: Active spacecraft / missions */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Spacecraft status header */}
          <div className="card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span className="card-label" style={{ marginBottom:0 }}>SPACECRAFT STATUS:</span>
                  <span className="badge badge-caution">CAUTION</span>
                </div>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"1.4rem", fontWeight:700, letterSpacing:4, color:"var(--text-primary)" }}>
                  {missions[0]?.name?.toUpperCase() || "NO MISSION"}
                </div>
                <div style={{ fontSize:"0.72rem", color:"var(--text-muted)", marginTop:3 }}>
                  {missions[0]?.planet || "—"} · {missions[0]?.status || "—"}
                </div>
              </div>
              <CircularGauge pct={successRate} />
            </div>

            {/* Countdown */}
            <div className="section-label" style={{ marginTop:12 }}>LAUNCH READINESS</div>
            <div className="countdown">
              <CountdownUnit value={135} label="DAYS" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={21}  label="HOURS" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={38}  label="MINUTES" />
            </div>

            {/* Readiness grid */}
            <div className="readiness-grid">
              <div className="readiness-card danger">
                <span className="readiness-icon">🛡</span>
                <div style={{ paddingLeft:24 }}>
                  <div className="readiness-percent">62%</div>
                  <div className="readiness-name">Mission Control</div>
                </div>
                <span className="readiness-score-label">3/5</span>
              </div>
              <div className="readiness-card caution">
                <span className="readiness-icon">👨‍🚀</span>
                <div style={{ paddingLeft:24 }}>
                  <div className="readiness-percent">74%</div>
                  <div className="readiness-name">Crew Readiness</div>
                </div>
                <span className="readiness-score-label">4/5</span>
              </div>
              <div className="readiness-card good">
                <span className="readiness-icon">📦</span>
                <div style={{ paddingLeft:24 }}>
                  <div className="readiness-percent">78%</div>
                  <div className="readiness-name">Logistics & Supply</div>
                </div>
                <span className="readiness-score-label">4/5</span>
              </div>
              <div className="readiness-card great">
                <span className="readiness-icon">📡</span>
                <div style={{ paddingLeft:24 }}>
                  <div className="readiness-percent">95%</div>
                  <div className="readiness-name">Ground Systems</div>
                </div>
                <span className="readiness-score-label">5/5</span>
              </div>
            </div>
          </div>

          {/* Active programs */}
          <div className="card">
            <div className="section-label">ACTIVE PROGRAMS</div>
            {missions.map((m, i) => (
              <div key={m._id} className="program-item">
                <div className="program-icon">🚀</div>
                <div className="program-info">
                  <div className="program-name">
                    <span className="program-dot" style={{
                      background: m.status==="Active" ? "var(--green)"
                        : m.status==="Failed" ? "var(--red)"
                        : m.status==="Completed" ? "var(--blue)"
                        : "var(--yellow)"
                    }} />
                    {m.name}
                  </div>
                  <div className="program-sub">{m.planet} · {m.launchDate || "TBD"}</div>
                </div>
                <div className="program-right">
                  <div className="program-progress-label">
                    {m.status === "Active"    ? `${60 + i*7}% ACTIVE` :
                     m.status === "Completed" ? "100% DONE"    :
                     m.status === "Failed"    ? "ABORTED"      :
                     "PLANNED"}
                  </div>
                  <div className="program-eta">ETA Q{(i % 4) + 1}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, display:"flex", gap:8 }}>
              <Link to="/missions" style={{ flex:1 }}>
                <button className="btn btn-ghost btn-sm" style={{ width:"100%", justifyContent:"center" }}>
                  VIEW ALL MISSIONS
                </button>
              </Link>
              <Link to="/missions">
                <button className="btn btn-outline btn-sm">+ NEW PROGRAM</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
