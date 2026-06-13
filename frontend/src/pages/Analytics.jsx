import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const monthly = [
  { month:"JAN", active:4, completed:1, failed:0, planned:2 },
  { month:"FEB", active:5, completed:2, failed:0, planned:3 },
  { month:"MAR", active:6, completed:3, failed:1, planned:2 },
  { month:"APR", active:7, completed:3, failed:1, planned:4 },
  { month:"MAY", active:8, completed:3, failed:1, planned:3 },
  { month:"JUN", active:8, completed:3, failed:1, planned:5 },
];

const pie = [
  { name:"Active",    value:8, color:"#22c55e" },
  { name:"Completed", value:3, color:"#3b82f6" },
  { name:"Failed",    value:1, color:"#ef4444" },
  { name:"Planned",   value:5, color:"#eab308" },
];

const systems = [
  { t:"JAN", propulsion:85, avionics:72, power:90, thermal:78 },
  { t:"FEB", propulsion:88, avionics:75, power:85, thermal:80 },
  { t:"MAR", propulsion:72, avionics:80, power:88, thermal:74 },
  { t:"APR", propulsion:78, avionics:78, power:82, thermal:76 },
  { t:"MAY", propulsion:83, avionics:82, power:84, thermal:82 },
  { t:"JUN", propulsion:88, avionics:85, power:86, thermal:80 },
];

const planets = [
  { planet:"Mars", n:4 }, { planet:"Moon", n:3 }, { planet:"Jupiter", n:2 },
  { planet:"Saturn", n:2 }, { planet:"Venus", n:1 }, { planet:"Mercury", n:1 },
];

const TT = {
  contentStyle: { backgroundColor:"#131315", border:"1px solid #222228", borderRadius:8, color:"#e8e8ec", fontFamily:"Space Mono, monospace", fontSize:11 },
  itemStyle:    { color:"#e8e8ec" },
  labelStyle:   { color:"#f97316", letterSpacing:1 },
  cursor:       { stroke:"var(--border-2)" },
};

const KPIs = [
  { icon:"◎", label:"SUCCESS RATE",    value:"25%",  color:"var(--green)"  },
  { icon:"◈", label:"TOTAL MISSIONS",  value:"12",   color:"var(--orange)" },
  { icon:"◉", label:"PLANETS EXPLORED",value:"6",    color:"var(--purple)" },
  { icon:"◬", label:"FAILURE RATE",    value:"8%",   color:"var(--red)"    },
  { icon:"◫", label:"CURRENT TREND",   value:"88%",  color:"var(--blue)"   },
];

export default function Analytics() {
  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">ASTRAMIND / ANALYTICS</div>
        <h1 className="page-title">AI Forecast & Simulation</h1>
        <p className="page-subtitle">Real-time risk identification, cascading analysis &amp; proactive mitigation</p>
      </div>

      {/* KPI gradient cards */}
      <div className="stats-grid" style={{ marginBottom:22 }}>
        {KPIs.map((k,i) => (
          <div key={k.label} className={`metric-card ${i===0?"red-grad":i===3?"red-grad":i===4?"blue-grad":i===2?"purple-grad":"orange-grad"}`}>
            <div className="metric-header">
              <div className="metric-icon" style={{ background:"transparent", fontSize:"1rem", color:k.color }}>{k.icon}</div>
            </div>
            <div className="metric-value" style={{ color:k.color, fontSize:"2rem" }}>{k.value}</div>
            <div className="metric-sublabel">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap:16, marginBottom:16 }}>

        {/* Spacecraft systems chart */}
        <div className="card">
          <div className="section-label">SPACECRAFT SYSTEMS</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={systems}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" />
              <XAxis dataKey="t"         tick={{ fill:"var(--text-muted)", fontSize:10, fontFamily:"Space Mono" }} stroke="var(--border)" />
              <YAxis domain={[60,100]}   tick={{ fill:"var(--text-muted)", fontSize:10, fontFamily:"Space Mono" }} stroke="var(--border)" />
              <Tooltip {...TT} />
              <Legend iconType="circle" iconSize={6}
                formatter={v => <span style={{ fontFamily:"Space Mono", fontSize:10, color:"var(--text-muted)" }}>{v}</span>} />
              <Line type="monotone" dataKey="propulsion" stroke="#22c55e"  strokeWidth={1.5} dot={false} name="Propulsion System" />
              <Line type="monotone" dataKey="avionics"   stroke="#3b82f6"  strokeWidth={1.5} dot={false} name="Avionic Suite" />
              <Line type="monotone" dataKey="power"      stroke="#a855f7"  strokeWidth={1.5} dot={false} name="Power Systems" />
              <Line type="monotone" dataKey="thermal"    stroke="#22c55e"  strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Thermal Protection" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mission distribution pie */}
        <div className="card">
          <div className="section-label">MISSION STATUS DISTRIBUTION</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pie} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} dataKey="value">
                {pie.map((e,i) => <Cell key={i} fill={e.color} stroke="none" />)}
              </Pie>
              <Tooltip {...TT} />
              <Legend iconType="circle" iconSize={6}
                formatter={(v, e) => <span style={{ fontFamily:"Space Mono", fontSize:10, color:"var(--text-secondary)" }}>{v} ({e.payload.value})</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="card" style={{ marginBottom:16 }}>
        <div className="section-label">MONTHLY MISSION ACTIVITY</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} barSize={14} barGap={3}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill:"var(--text-muted)", fontSize:10, fontFamily:"Space Mono" }} stroke="var(--border)" />
            <YAxis tick={{ fill:"var(--text-muted)", fontSize:10, fontFamily:"Space Mono" }} stroke="var(--border)" />
            <Tooltip {...TT} />
            <Legend iconType="square" iconSize={8}
              formatter={v => <span style={{ fontFamily:"Space Mono", fontSize:10, color:"var(--text-muted)" }}>{v}</span>} />
            <Bar dataKey="active"    fill="#22c55e" name="Active"    radius={[3,3,0,0]} />
            <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[3,3,0,0]} />
            <Bar dataKey="failed"    fill="#ef4444" name="Failed"    radius={[3,3,0,0]} />
            <Bar dataKey="planned"   fill="#eab308" name="Planned"   radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline simulation — inspo style */}
      <div className="card">
        <div className="section-label">TIMELINE IMPACT SIMULATION</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
          {[
            { label:"BASELINE",   conf:"75% CONF", desc:"Current trajectory with no interventions",     date:"2026-12-15", risks:4, color:"var(--text-muted)",  riskColor:"var(--yellow)" },
            { label:"OPTIMISTIC", conf:"85% CONF", desc:"With recommended interventions applied",        date:"2026-09-24", risks:1, color:"var(--green)",       riskColor:"var(--green)"  },
            { label:"PESSIMISTIC",conf:"65% CONF", desc:"If supply chain issues persist",               date:"2027-05-12", risks:7, color:"var(--red)",         riskColor:"var(--red)"    },
          ].map(s => (
            <div key={s.label} style={{ background:"var(--bg-card-2)", border:`1px solid var(--border)`, borderRadius:"var(--radius-md)", padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", fontWeight:700, color:"var(--text-secondary)", letterSpacing:1 }}>{s.label}</span>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:s.color }}>{s.conf}</span>
              </div>
              <div style={{ fontSize:"0.72rem", color:"var(--text-muted)", marginBottom:10, lineHeight:1.5 }}>{s.desc}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--text-secondary)" }}>
                  📅 {s.date}
                </span>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:s.riskColor }}>
                  ◬ {s.risks} RISKS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
