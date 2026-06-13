import { useState, useEffect } from "react";
import { getMissions, createMission, updateMission, deleteMission } from "../api";

const EMPTY_FORM = {
  name: "",
  planet: "",
  status: "Planned",
  launchDate: "",
  description: "",
  crew: "",
  duration: "",
};

const PLANETS = ["Mercury", "Venus", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Europa", "Titan", "Other"];
const STATUSES = ["Planned", "Active", "Completed", "Failed"];

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const res = await getMissions();
      setMissions(res.data);
    } catch {
      setError("Cannot connect to backend. Showing demo data.");
      setMissions([
        { _id: "1", name: "Mars Explorer I", planet: "Mars", status: "Active", launchDate: "2026-06-15", description: "Primary Mars surface exploration", crew: 7, duration: "18 months" },
        { _id: "2", name: "Titan Probe", planet: "Saturn", status: "Active", launchDate: "2026-08-20", description: "Titan atmosphere analysis", crew: 4, duration: "36 months" },
        { _id: "3", name: "Europa Discovery", planet: "Jupiter", status: "Completed", launchDate: "2025-03-10", description: "Search for subsurface ocean life", crew: 6, duration: "24 months" },
        { _id: "4", name: "Venus Survey", planet: "Venus", status: "Failed", launchDate: "2025-11-05", description: "Atmospheric drone deployment", crew: 3, duration: "6 months" },
        { _id: "5", name: "Lunar Gateway II", planet: "Moon", status: "Planned", launchDate: "2027-01-01", description: "Permanent lunar orbit station", crew: 12, duration: "60 months" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (m) => {
    setForm({ name: m.name, planet: m.planet, status: m.status, launchDate: m.launchDate, description: m.description || "", crew: m.crew || "", duration: m.duration || "" });
    setEditId(m._id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(EMPTY_FORM); };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        const res = await updateMission(editId, form);
        setMissions((prev) => prev.map((m) => (m._id === editId ? res.data : m)));
      } else {
        const res = await createMission(form);
        setMissions((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch {
      alert("Failed to save. Check backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mission?")) return;
    try {
      await deleteMission(id);
      setMissions((prev) => prev.filter((m) => m._id !== id));
    } catch {
      setMissions((prev) => prev.filter((m) => m._id !== id));
    }
  };

  const statusBadge = (s) => {
    const cls = { Active: "badge-active", Completed: "badge-completed", Failed: "badge-failed", Planned: "badge-planned" };
    const dots = { Active: "🟢", Completed: "🟣", Failed: "🔴", Planned: "🟡" };
    return <span className={`badge ${cls[s]}`}>{dots[s]} {s}</span>;
  };

  const filtered = filter === "All" ? missions : missions.filter((m) => m.status === filter);

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">🚀 Mission Registry</h2>
        <p className="page-subtitle">{error || "Create, manage, and track interplanetary missions"}</p>
      </div>

      {/* Filters + Add button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Active", "Planned", "Completed", "Failed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button id="add-mission-btn" className="btn btn-primary" onClick={openCreate}>
          ➕ New Mission
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Total", value: missions.length, color: "var(--accent-cyan)" },
          { label: "Active", value: missions.filter(m => m.status === "Active").length, color: "var(--accent-green)" },
          { label: "Completed", value: missions.filter(m => m.status === "Completed").length, color: "#a78bfa" },
          { label: "Failed", value: missions.filter(m => m.status === "Failed").length, color: "var(--accent-red)" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "10px 20px", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.2rem", color: s.color, fontWeight: 700 }}>{s.value}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner" />
          <p style={{ color: "var(--text-muted)" }}>Loading missions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛸</div>
          <h3>No missions found</h3>
          <p>Click "New Mission" to launch your first mission</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mission Name</th>
                  <th>Planet</th>
                  <th>Status</th>
                  <th>Launch Date</th>
                  <th>Crew</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m._id}>
                    <td style={{ color: "var(--text-muted)", fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem" }}>{String(i + 1).padStart(2, "0")}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      {m.description && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{m.description.slice(0, 50)}{m.description.length > 50 ? "..." : ""}</div>}
                    </td>
                    <td>
                      <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>🪐 {m.planet}</span>
                    </td>
                    <td>{statusBadge(m.status)}</td>
                    <td style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.72rem", color: "var(--text-secondary)" }}>{m.launchDate || "—"}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{m.crew ? `👨‍🚀 ${m.crew}` : "—"}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{m.duration || "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(m)} title="Edit">✏️</button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(m._id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editId ? "✏️ EDIT MISSION" : "🚀 NEW MISSION"}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form id="mission-form" onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Mission Name *</label>
                  <input id="mission-name" name="name" className="form-control" placeholder="Mars Explorer I" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Planet *</label>
                  <select id="mission-planet" name="planet" className="form-control" value={form.planet} onChange={handleChange} required>
                    <option value="">Select Planet</option>
                    {PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select id="mission-status" name="status" className="form-control" value={form.status} onChange={handleChange}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Launch Date</label>
                  <input id="mission-launch-date" type="date" name="launchDate" className="form-control" value={form.launchDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Crew Size</label>
                  <input id="mission-crew" type="number" name="crew" className="form-control" placeholder="7" value={form.crew} onChange={handleChange} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input id="mission-duration" name="duration" className="form-control" placeholder="18 months" value={form.duration} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea id="mission-description" name="description" className="form-control" rows={3} placeholder="Mission objectives and details..." value={form.description} onChange={handleChange} style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button id="mission-submit-btn" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editId ? "Update Mission" : "Launch Mission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
