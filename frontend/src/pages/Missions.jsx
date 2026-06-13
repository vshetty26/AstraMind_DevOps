import { useState, useEffect } from "react";
import { getMissions, createMission, updateMission, deleteMission } from "../api";

const EMPTY = { name:"", planet:"", status:"Planned", launchDate:"", description:"", crew:"", duration:"" };
const PLANETS = ["Mercury","Venus","Moon","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto","Europa","Titan","Other"];
const STATUSES = ["Planned","Active","Completed","Failed"];

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShow]    = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [filter, setFilter]     = useState("All");
  const [offline, setOffline]   = useState(false);

  const load = async () => {
    try {
      const res = await getMissions();
      setMissions(res.data);
    } catch {
      setOffline(true);
      setMissions([
        { _id:"1", name:"Mars Explorer I",  planet:"Mars",    status:"Active",    launchDate:"2026-06-15", description:"Primary Mars surface exploration", crew:7,  duration:"18 months" },
        { _id:"2", name:"Titan Probe",       planet:"Saturn",  status:"Active",    launchDate:"2026-08-20", description:"Titan atmosphere analysis",        crew:4,  duration:"36 months" },
        { _id:"3", name:"Europa Discovery",  planet:"Jupiter", status:"Completed", launchDate:"2025-03-10", description:"Subsurface ocean life search",     crew:6,  duration:"24 months" },
        { _id:"4", name:"Venus Survey",      planet:"Venus",   status:"Failed",    launchDate:"2025-11-05", description:"Atmospheric drone deployment",     crew:3,  duration:"6 months"  },
        { _id:"5", name:"Lunar Gateway II",  planet:"Moon",    status:"Planned",   launchDate:"2027-01-01", description:"Permanent lunar orbit station",    crew:12, duration:"60 months" },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShow(true); };
  const openEdit   = (m) => { setForm({ name:m.name, planet:m.planet, status:m.status, launchDate:m.launchDate, description:m.description||"", crew:m.crew||"", duration:m.duration||"" }); setEditId(m._id); setShow(true); };
  const closeModal = () => { setShow(false); setEditId(null); setForm(EMPTY); };
  const onChange   = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) {
        const r = await updateMission(editId, form);
        setMissions(p => p.map(m => m._id === editId ? r.data : m));
      } else {
        const r = await createMission(form);
        setMissions(p => [r.data, ...p]);
      }
      closeModal();
    } catch { alert("Save failed — check backend."); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this mission?")) return;
    try { await deleteMission(id); } catch {}
    setMissions(p => p.filter(m => m._id !== id));
  };

  const statusBadge = (s) => {
    const cls = { Active:"badge-active", Completed:"badge-completed", Failed:"badge-failed", Planned:"badge-planned" };
    return <span className={`badge ${cls[s]||""}`}>{s}</span>;
  };

  const statusColor = (s) => s==="Active" ? "var(--green)" : s==="Completed" ? "var(--blue)" : s==="Failed" ? "var(--red)" : "var(--yellow)";

  const filtered = filter === "All" ? missions : missions.filter(m => m.status === filter);
  const counts   = { Active: missions.filter(m=>m.status==="Active").length, Completed: missions.filter(m=>m.status==="Completed").length, Failed: missions.filter(m=>m.status==="Failed").length, Planned: missions.filter(m=>m.status==="Planned").length };

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">ASTRAMIND / MISSIONS</div>
        <h1 className="page-title">Mission Registry</h1>
        <p className="page-subtitle">{offline ? "⚠  Demo data — backend offline" : "Create, manage and track all interplanetary missions"}</p>
      </div>

      {/* Stat strip */}
      <div className="stats-grid" style={{ gridTemplateColumns:"repeat(5,1fr)", marginBottom:18 }}>
        {[
          { label:"TOTAL",     value:missions.length, color:"var(--text-primary)", grad:"" },
          { label:"ACTIVE",    value:counts.Active,    color:"var(--green)",  grad:"" },
          { label:"COMPLETED", value:counts.Completed, color:"var(--blue)",   grad:"" },
          { label:"FAILED",    value:counts.Failed,    color:"var(--red)",    grad:"red-grad" },
          { label:"PLANNED",   value:counts.Planned,   color:"var(--yellow)", grad:"" },
        ].map(s => (
          <div key={s.label} className={`metric-card ${s.grad}`}>
            <div className="metric-value" style={{ fontSize:"1.6rem", color:s.color }}>{s.value}</div>
            <div className="metric-sublabel">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="filter-row">
        <div className="filter-pills">
          {["All","Active","Planned","Completed","Failed"].map(f => (
            <button key={f} className={`btn btn-sm ${filter===f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <button id="add-mission-btn" className="btn btn-primary" onClick={openCreate}>
          + NEW MISSION
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-wrapper"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <h3>No Missions Found</h3>
          <p>Launch a new mission to get started</p>
        </div>
      ) : (
        <div className="card" style={{ padding:0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mission</th>
                  <th>Destination</th>
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
                    <td>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"var(--text-muted)" }}>
                        {String(i+1).padStart(2,"0")}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:statusColor(m.status), boxShadow:`0 0 6px ${statusColor(m.status)}`, display:"inline-block", flexShrink:0 }} />
                        <div>
                          <div style={{ fontWeight:600, fontSize:"0.85rem" }}>{m.name}</div>
                          {m.description && <div style={{ fontSize:"0.68rem", color:"var(--text-muted)", marginTop:1 }}>{m.description.slice(0,45)}{m.description.length>45?"...":""}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.75rem", color:"var(--orange)", letterSpacing:1 }}>
                        {m.planet}
                      </span>
                    </td>
                    <td>{statusBadge(m.status)}</td>
                    <td style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", color:"var(--text-secondary)" }}>{m.launchDate||"—"}</td>
                    <td style={{ fontFamily:"var(--font-mono)", fontSize:"0.75rem", color:"var(--text-secondary)" }}>{m.crew ? `${m.crew}` : "—"}</td>
                    <td style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>{m.duration||"—"}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(m)} title="Edit">✎</button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(m._id)} title="Delete">✕</button>
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
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editId ? "EDIT MISSION" : "NEW MISSION"}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form id="mission-form" onSubmit={submit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Mission Name *</label>
                  <input id="mission-name" name="name" className="form-control" placeholder="Mars Explorer I" value={form.name} onChange={onChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination *</label>
                  <select id="mission-planet" name="planet" className="form-control" value={form.planet} onChange={onChange} required>
                    <option value="">Select planet</option>
                    {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select id="mission-status" name="status" className="form-control" value={form.status} onChange={onChange}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Launch Date</label>
                  <input id="mission-launch-date" type="date" name="launchDate" className="form-control" value={form.launchDate} onChange={onChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Crew Size</label>
                  <input id="mission-crew" type="number" name="crew" className="form-control" placeholder="7" value={form.crew} onChange={onChange} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input id="mission-duration" name="duration" className="form-control" placeholder="18 months" value={form.duration} onChange={onChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea id="mission-description" name="description" className="form-control" rows={3} placeholder="Mission objectives..." value={form.description} onChange={onChange} style={{ resize:"vertical" }} />
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>CANCEL</button>
                <button id="mission-submit-btn" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "SAVING..." : editId ? "UPDATE MISSION" : "LAUNCH MISSION"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
