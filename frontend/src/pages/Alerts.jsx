import { useState } from "react";

const INIT_ALERTS = [
  { id:1, type:"critical", title:"Battery Critical — Deep Space Relay",      desc:"Battery level at 15%. Immediate power conservation required.",             mission:"Deep Space Relay",  time:"00:02:14", cond:"battery < 20%",    score:92 },
  { id:2, type:"critical", title:"Signal Lost — Deep Space Relay",            desc:"Weak signal detected. Communication integrity at risk.",                   mission:"Deep Space Relay",  time:"00:05:30", cond:'signal === "Weak"',  score:88 },
  { id:3, type:"warning",  title:"High Temperature — Mars Explorer I",        desc:"Surface temperature reading 45°C — approaching thermal threshold.",        mission:"Mars Explorer I",   time:"00:12:07", cond:"temperature > 40°C", score:67 },
  { id:4, type:"warning",  title:"Battery Moderate — Titan Probe",            desc:"Battery at 67%. Recommend scheduling recharge cycle.",                     mission:"Titan Probe",       time:"00:18:45", cond:"battery < 70%",      score:54 },
  { id:5, type:"info",     title:"Telemetry Sync — Lunar Gateway II",         desc:"All telemetry channels synchronized. Systems nominal.",                   mission:"Lunar Gateway II",  time:"00:25:00", cond:"sync complete",      score:12 },
  { id:6, type:"info",     title:"Orbital Correction — Mars Explorer I",      desc:"Scheduled orbital correction maneuver completed successfully.",             mission:"Mars Explorer I",   time:"00:31:20", cond:"maneuver complete",  score:8  },
];

const RISK_ITEMS = [
  { id:1, name:"INCONEL 718",   type:"Shortage", tags:["#INVENTORY","#PIPELINE"],    stock:"320 KG",  rate:"25 KG/DAY", days:13, likely:42, score:92, color:"var(--red)"    },
  { id:2, name:"CARBON FIBER",  type:"Shortage", tags:["#INVENTORY","#SUPPLY CHAIN"],stock:"890 KG",  rate:"Forecast",  days:20, likely:74, score:76, color:"var(--orange)" },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const [filter, setFilter] = useState("All");
  const [dismissed, setDismissed] = useState([]);

  const dismiss = (id) => {
    setAlerts(p => p.filter(a => a.id !== id));
    setDismissed(p => [...p, id]);
  };

  const filtered = filter === "All" ? alerts : alerts.filter(a => a.type === filter.toLowerCase());
  const critical = alerts.filter(a => a.type==="critical").length;
  const warning  = alerts.filter(a => a.type==="warning").length;
  const info     = alerts.filter(a => a.type==="info").length;

  const typeColor = { critical:"var(--red)", warning:"var(--orange)", info:"var(--blue)" };
  const typeIcon  = { critical:"◈", warning:"◬", info:"◉" };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">ASTRAMIND / ALERTS</div>
        <h1 className="page-title">Alert System</h1>
        <p className="page-subtitle">Real-time risk identification, cascading analysis & proactive mitigation</p>
      </div>

      {/* Top stat cards — inspo style gradient */}
      <div className="stats-grid" style={{ gridTemplateColumns:"repeat(4,1fr)", marginBottom:22 }}>
        <div className="metric-card red-grad">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <span className="badge badge-critical">CRITICAL</span>
          </div>
          <div className="metric-value" style={{ color:"var(--red)", fontSize:"2.2rem" }}>{critical}</div>
          <div className="metric-sublabel">Avg Score: {critical ? 90 : 0}</div>
        </div>
        <div className="metric-card orange-grad">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <span className="badge badge-high">HIGH</span>
          </div>
          <div className="metric-value" style={{ color:"var(--orange)", fontSize:"2.2rem" }}>{warning}</div>
          <div className="metric-sublabel">Avg Score: {warning ? 61 : 0}</div>
        </div>
        <div className="metric-card blue-grad">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <span className="badge badge-active">ACTIVE</span>
          </div>
          <div className="metric-value" style={{ color:"var(--blue)", fontSize:"2.2rem" }}>{alerts.length}</div>
          <div className="metric-sublabel">Total Identified</div>
        </div>
        <div className="metric-card purple-grad">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <span className="badge badge-completed">RESOLVED</span>
          </div>
          <div className="metric-value" style={{ color:"var(--purple)", fontSize:"2.2rem" }}>{dismissed.length}</div>
          <div className="metric-sublabel">AI Suggestions Applied</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap:16 }}>

        {/* LEFT: Alert list */}
        <div>
          <div className="section-label">AUTOMATED RISK IDENTIFICATION</div>
          <div className="filter-row" style={{ marginBottom:14 }}>
            <div className="filter-pills">
              {["All","Critical","Warning","Info"].map(f => (
                <button key={f} className={`btn btn-sm ${filter===f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            {alerts.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setAlerts([])}>CLEAR ALL</button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>All Clear</h3>
              <p>No active alerts at this time</p>
            </div>
          ) : (
            filtered.map(a => (
              <div key={a.id} className={`alert-item alert-${a.type}`}>
                <div className="alert-icon-wrap">
                  <span style={{ color: typeColor[a.type], fontSize:"0.85rem" }}>{typeIcon[a.type]}</span>
                </div>
                <div className="alert-content">
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-desc">{a.desc}</div>
                  <div className="alert-meta">
                    <span className="alert-meta-item">◎ {a.mission}</span>
                    <span className="alert-meta-item">T+{a.time}</span>
                    <span className="alert-meta-item" style={{ fontStyle:"italic" }}>IF {a.cond}</span>
                    {a.score && <span className="alert-meta-item" style={{ color: typeColor[a.type] }}>RISK {a.score}</span>}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => dismiss(a.id)} style={{ flexShrink:0, alignSelf:"flex-start" }}>
                  DISMISS
                </button>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Risk details + alert logic */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Risk items — inspo style */}
          <div className="card">
            <div className="section-label">RISK IDENTIFICATION DETAIL</div>
            {RISK_ITEMS.map(r => (
              <div key={r.id} className="pipeline-item" style={{ marginBottom:12 }}>
                <div className="pipeline-header">
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"var(--text-primary)", fontWeight:700, letterSpacing:1 }}>{r.name}</span>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", color:r.color }}>RISK SCORE</span>
                    </div>
                    <div style={{ fontSize:"0.68rem", color:"var(--text-muted)", marginTop:2 }}>{r.type}</div>
                    <div style={{ display:"flex", gap:6, marginTop:4 }}>
                      {r.tags.map(t => (
                        <span key={t} style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"var(--orange)", letterSpacing:1 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:"1.4rem", fontWeight:700, color:r.color }}>{r.score}</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
                  <div style={{ fontSize:"0.72rem" }}>
                    <span style={{ color:"var(--text-muted)" }}>Stock Level</span>
                    <span style={{ float:"right", fontFamily:"var(--font-mono)", color:"var(--text-secondary)" }}>{r.stock}</span>
                  </div>
                  <div style={{ fontSize:"0.72rem" }}>
                    <span style={{ color:"var(--text-muted)" }}>Rate</span>
                    <span style={{ float:"right", fontFamily:"var(--font-mono)", color:"var(--text-secondary)" }}>{r.rate}</span>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:r.color }}>
                    {r.days} DAYS ◈
                  </span>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--yellow)" }}>
                    {r.likely}% LIKELY
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Alert logic reference */}
          <div className="card">
            <div className="section-label">ALERT LOGIC REFERENCE</div>
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
                    { cond:"battery < 20%",      sev:"CRITICAL", scls:"badge-critical", action:"Power conservation protocol" },
                    { cond:"battery < 50%",      sev:"WARNING",  scls:"badge-warning",  action:"Monitor backup systems"      },
                    { cond:'signal === "Lost"',   sev:"CRITICAL", scls:"badge-critical", action:"Activate redundant comms"    },
                    { cond:'signal === "Weak"',   sev:"WARNING",  scls:"badge-warning",  action:"Increase antenna gain"       },
                    { cond:"temperature > 80°C", sev:"CRITICAL", scls:"badge-critical", action:"Thermal shutdown protocol"   },
                    { cond:"temperature > 50°C", sev:"WARNING",  scls:"badge-warning",  action:"Activate cooling systems"    },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td><code style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:"var(--orange)", background:"rgba(249,115,22,0.08)", padding:"2px 8px", borderRadius:4 }}>{row.cond}</code></td>
                      <td><span className={`badge ${row.scls}`}>{row.sev}</span></td>
                      <td style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
