import { useState, useEffect } from "react";

const FLEET = [
  { id:1, mission:"Mars Explorer I",  planet:"Mars",          battery:89,  signal:"Strong",   temperature:45,   pressure:0.636, altitude:1200,   velocity:3600,  distance:225000000, status:"Nominal" },
  { id:2, mission:"Titan Probe",       planet:"Saturn/Titan",  battery:67,  signal:"Moderate", temperature:-179, pressure:1.47,  altitude:50000,  velocity:5900,  distance:1270000000,status:"Nominal" },
  { id:3, mission:"Lunar Gateway II",  planet:"Moon",          battery:95,  signal:"Strong",   temperature:107,  pressure:0,     altitude:400000, velocity:1022,  distance:384400,    status:"Nominal" },
  { id:4, mission:"Deep Space Relay",  planet:"Asteroid Belt", battery:15,  signal:"Weak",     temperature:-80,  pressure:0,     altitude:0,      velocity:18000, distance:450000000, status:"Warning" },
];

const battColor = (v) => v>=70 ? "var(--green)" : v>=30 ? "var(--yellow)" : "var(--red)";
const sigColor  = (s) => s==="Strong" ? "var(--green)" : s==="Moderate" ? "var(--yellow)" : "var(--red)";
const sigBars   = (s) => s==="Strong" ? "▮▮▮▮" : s==="Moderate" ? "▮▮▮▯" : "▮▮▯▯";

export default function Telemetry() {
  const [sel, setSel]   = useState(FLEET[0]);
  const [live, setLive] = useState(FLEET[0]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLive({ ...sel });
  }, [sel]);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t+1);
      setLive(p => ({
        ...p,
        battery:     Math.max(0, Math.min(100, p.battery + (Math.random()-.5)*1.5)),
        temperature: +(p.temperature + (Math.random()-.5)*2).toFixed(1),
        velocity:    Math.round(p.velocity + (Math.random()-.5)*80),
        altitude:    Math.round(p.altitude + (Math.random()-.5)*30),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, [sel]);

  const cards = [
    { icon:"🔋", label:"BATTERY",        value:`${live.battery.toFixed(1)}%`,  color:battColor(live.battery),    accent:"orange-accent", sub:"Power level", pct:live.battery },
    { icon:"📶", label:"SIGNAL",         value:sigBars(live.signal),            color:sigColor(live.signal),      accent:"green-accent",  sub:live.signal    },
    { icon:"🌡", label:"TEMPERATURE",    value:`${live.temperature.toFixed(1)}°C`, color: live.temperature>80?"var(--red)":live.temperature<-100?"var(--blue)":"var(--orange)", accent:"", sub:"Surface reading" },
    { icon:"🚀", label:"VELOCITY",       value:`${live.velocity.toLocaleString()}`, color:"var(--text-primary)", accent:"blue-accent",   sub:"km/h relative" },
    { icon:"⬆", label:"ALTITUDE",       value:`${live.altitude.toLocaleString()}`, color:"var(--text-primary)", accent:"",              sub:"km above surface" },
    { icon:"🌍", label:"DISTANCE",       value:`${(live.distance/1e6).toFixed(1)}M`, color:"var(--purple)",      accent:"purple-accent", sub:"km from Earth" },
    { icon:"🧪", label:"PRESSURE",       value:`${live.pressure} atm`,           color:"var(--text-primary)",    accent:"",              sub:"Atmospheric" },
    { icon:"◉",  label:"MISSION STATUS", value:live.status==="Warning"?"WARNING":"NOMINAL", color:live.status==="Warning"?"var(--red)":"var(--green)", accent: live.status==="Warning" ? "red-accent" : "green-accent", sub:"All systems check" },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">ASTRAMIND / TELEMETRY</div>
        <h1 className="page-title">Telemetry Center</h1>
        <p className="page-subtitle">Live data feeds from active deep-space missions</p>
      </div>

      {/* Mission selector */}
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {FLEET.map(m => (
          <button key={m.id} className={`btn btn-sm ${sel.id===m.id ? "btn-primary" : "btn-ghost"}`} onClick={() => setSel(m)}>
            {m.status==="Warning" ? "◬" : "◎"} {m.mission}
          </button>
        ))}
      </div>

      {/* Live indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <div className="status-dot" />
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.62rem", color:"var(--green)", letterSpacing:2 }}>
          LIVE · {live.mission} · {live.planet}
        </span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", color:"var(--text-muted)" }}>
          T+{String(Math.floor(tick/3600)).padStart(2,"0")}:{String(Math.floor((tick%3600)/60)).padStart(2,"0")}:{String(tick%60).padStart(2,"0")} · REFRESH EVERY 3S
        </span>
      </div>

      {/* Telemetry cards */}
      <div className="telem-grid">
        {cards.map(c => (
          <div key={c.label} className={`telem-card ${c.accent}`}>
            <div className="telem-icon">{c.icon}</div>
            <div className="telem-value" style={{ color:c.color }}>{c.value}</div>
            <div className="telem-label">{c.label}</div>
            <div style={{ fontSize:"0.62rem", color:"var(--text-muted)", marginTop:4 }}>{c.sub}</div>
            {c.pct !== undefined && (
              <div className="progress-track" style={{ marginTop:8 }}>
                <div className="progress-fill" style={{ width:`${c.pct}%`, background:c.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fleet overview */}
      <div className="card" style={{ marginTop:8 }}>
        <div className="section-label">FLEET OVERVIEW</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mission</th>
                <th>Planet</th>
                <th>Battery</th>
                <th>Signal</th>
                <th>Temp (°C)</th>
                <th>Velocity</th>
                <th>Distance (km)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {FLEET.map(m => (
                <tr key={m.id} style={{ cursor:"pointer" }} onClick={() => setSel(m)}>
                  <td style={{ fontWeight:600, color: sel.id===m.id ? "var(--orange)" : "var(--text-primary)" }}>{m.mission}</td>
                  <td style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"var(--orange)", letterSpacing:1 }}>{m.planet}</td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:50, background:"var(--bg-card-3)", borderRadius:4, height:4, overflow:"hidden" }}>
                        <div style={{ width:`${m.battery}%`, height:"100%", background:battColor(m.battery) }} />
                      </div>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:battColor(m.battery) }}>{m.battery}%</span>
                    </div>
                  </td>
                  <td><span style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:sigColor(m.signal), letterSpacing:2 }}>{sigBars(m.signal)}</span></td>
                  <td style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem", color: m.temperature>80?"var(--red)":"var(--text-secondary)" }}>{m.temperature}</td>
                  <td style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"var(--text-secondary)" }}>{m.velocity.toLocaleString()}</td>
                  <td style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--text-muted)" }}>{m.distance.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${m.status==="Warning" ? "badge-warning" : "badge-nominal"}`}>
                      {m.status}
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
