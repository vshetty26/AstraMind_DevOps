import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, AreaChart, Area,
} from "recharts";

const missionData = [
  { month: "Jan", active: 4, completed: 1, failed: 0, planned: 2 },
  { month: "Feb", active: 5, completed: 2, failed: 0, planned: 3 },
  { month: "Mar", active: 6, completed: 3, failed: 1, planned: 2 },
  { month: "Apr", active: 7, completed: 3, failed: 1, planned: 4 },
  { month: "May", active: 8, completed: 3, failed: 1, planned: 3 },
  { month: "Jun", active: 8, completed: 3, failed: 1, planned: 5 },
];

const pieData = [
  { name: "Active", value: 8, color: "#00ff88" },
  { name: "Completed", value: 3, color: "#7c3aed" },
  { name: "Failed", value: 1, color: "#ff3366" },
  { name: "Planned", value: 5, color: "#ffd700" },
];

const planetData = [
  { planet: "Mars", missions: 4 },
  { planet: "Moon", missions: 3 },
  { planet: "Jupiter", missions: 2 },
  { planet: "Saturn", missions: 2 },
  { planet: "Venus", missions: 1 },
  { planet: "Mercury", missions: 1 },
];

const successTrend = [
  { month: "Jan", rate: 80 },
  { month: "Feb", rate: 85 },
  { month: "Mar", rate: 72 },
  { month: "Apr", rate: 78 },
  { month: "May", rate: 83 },
  { month: "Jun", rate: 88 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "#0d1f3c",
  border: "1px solid #1a3a5c",
  borderRadius: 8,
  color: "#e8f4fd",
  fontSize: 12,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={TOOLTIP_STYLE}>
        <p style={{ margin: "8px 12px 4px", fontWeight: 700, color: "#00d4ff" }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ margin: "4px 12px", color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const total = pieData.reduce((a, b) => a + b.value, 0);
  const successRate = Math.round(((pieData[1].value) / total) * 100);
  const failRate = Math.round(((pieData[2].value) / total) * 100);

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">📊 Mission Analytics</h2>
        <p className="page-subtitle">Mission success rates, fleet distribution, and performance trends</p>
      </div>

      {/* KPI row */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { icon: "🎯", value: `${successRate}%`, label: "Success Rate", color: "var(--accent-green)" },
          { icon: "🚀", value: "12", label: "Total Missions", color: "var(--accent-cyan)" },
          { icon: "🌌", value: "6", label: "Planets Explored", color: "#a78bfa" },
          { icon: "💥", value: `${failRate}%`, label: "Failure Rate", color: "var(--accent-red)" },
          { icon: "📈", value: "88%", label: "Current Trend", color: "var(--accent-yellow)" },
        ].map((k) => (
          <div key={k.label} className="stat-card" style={{ textAlign: "center" }}>
            <div className="stat-icon">{k.icon}</div>
            <div className="stat-value" style={{ color: k.color, fontSize: "2rem" }}>{k.value}</div>
            <div className="stat-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Mission Distribution Pie */}
        <div className="card">
          <div className="card-title">🥧 Mission Status Distribution</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend
                formatter={(value, entry) => (
                  <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{value} ({entry.payload.value})</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Success Rate Trend */}
        <div className="card">
          <div className="card-title">📈 Success Rate Trend (%)</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={successTrend}>
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="month" stroke="#4a6080" tick={{ fill: "#4a6080", fontSize: 11 }} />
              <YAxis domain={[60, 100]} stroke="#4a6080" tick={{ fill: "#4a6080", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rate" stroke="#00ff88" fill="url(#successGrad)" strokeWidth={2} dot={{ fill: "#00ff88", r: 4 }} name="Success Rate" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Mission Activity */}
      <div className="card">
        <div className="card-title">📅 Monthly Mission Activity</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={missionData} barSize={18} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
            <XAxis dataKey="month" stroke="#4a6080" tick={{ fill: "#4a6080", fontSize: 11 }} />
            <YAxis stroke="#4a6080" tick={{ fill: "#4a6080", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{v}</span>} />
            <Bar dataKey="active" fill="#00ff88" name="Active" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#7c3aed" name="Completed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="failed" fill="#ff3366" name="Failed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="planned" fill="#ffd700" name="Planned" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Missions per Planet */}
      <div className="card">
        <div className="card-title">🪐 Missions by Destination Planet</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={planetData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
            <XAxis type="number" stroke="#4a6080" tick={{ fill: "#4a6080", fontSize: 11 }} />
            <YAxis dataKey="planet" type="category" stroke="#4a6080" tick={{ fill: "#8ba3c7", fontSize: 12 }} width={70} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="missions" fill="url(#barGrad)" name="Missions" radius={[0, 6, 6, 0]}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              {planetData.map((_, i) => (
                <Cell key={i} fill={`hsl(${200 + i * 25}, 80%, 60%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
