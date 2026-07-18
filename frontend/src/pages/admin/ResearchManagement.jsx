import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const DEFAULT_RESEARCH = [
  { id: 1, scholar: 'Rahul Sharma', topic: 'Artificial Intelligence in Healthcare Diagnostics', supervisor: 'Dr. Priya Kumar', dept: 'CS', startDate: '2021-08-01', status: 'Active', progress: 75, stage: 'Thesis Writing' },
  { id: 2, scholar: 'Neha Patel', topic: 'IoT-based Smart Agriculture System', supervisor: 'Dr. Rajan Mehta', dept: 'ECE', startDate: '2022-01-15', status: 'Active', progress: 60, stage: 'Data Collection' },
  { id: 3, scholar: 'Amit Kumar', topic: 'Blockchain for Supply Chain Management', supervisor: 'Dr. Sunita Rao', dept: 'CS', startDate: '2020-07-01', status: 'Completed', progress: 100, stage: 'Completed' },
  { id: 4, scholar: 'Sonal Joshi', topic: 'Deep Learning for NLP Tasks', supervisor: 'Dr. Priya Kumar', dept: 'CS', startDate: '2022-08-01', status: 'Active', progress: 45, stage: 'Literature Review' },
  { id: 5, scholar: 'Vikram Singh', topic: 'Renewable Energy in Urban Grids', supervisor: 'Dr. Rajan Mehta', dept: 'Mech', startDate: '2019-08-01', status: 'Completed', progress: 100, stage: 'Completed' },
  { id: 6, scholar: 'Pooja Mehta', topic: 'Quantum Computing in Cryptography', supervisor: 'Dr. A. Kapoor', dept: 'CS', startDate: '2023-01-01', status: 'Active', progress: 25, stage: 'Synopsis Preparation' },
  { id: 7, scholar: 'Kiran Rao', topic: 'Machine Learning for Predictive Analytics', supervisor: 'Dr. Sunita Rao', dept: 'CS', startDate: '2023-08-01', status: 'Active', progress: 15, stage: 'Course Work' },
]

const STAGES = ['Course Work', 'Synopsis Preparation', 'Literature Review', 'Data Collection', 'Thesis Writing', 'Viva Voce', 'Completed']
const STATUSES_OPT = ['Active', 'Completed', 'Discontinued']

const STAGE_COLORS = {
  'Course Work': '#6C63FF',
  'Synopsis Preparation': '#F59E0B',
  'Literature Review': '#3B82F6',
  'Data Collection': '#8B5CF6',
  'Thesis Writing': '#10B981',
  'Viva Voce': '#EF4444',
  'Completed': '#059669',
}

function ResearchModal({ onClose, onSave, editData = null }) {
  const emptyForm = { scholar: '', topic: '', supervisor: '', dept: 'CS', startDate: new Date().toISOString().slice(0, 10), status: 'Active', progress: 0, stage: 'Course Work' }
  const [form, setForm] = useState(editData ? { ...editData } : emptyForm)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.name === 'progress' ? Number(e.target.value) : e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.scholar || !form.topic || !form.supervisor) {
      toast.error('Scholar, Topic and Supervisor are required')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <span className="modal-title">{editData ? 'Edit Research Project' : 'Add New Research Project'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Scholar Name *</label>
                <input name="scholar" required className="form-control" placeholder="e.g. Rahul Sharma" value={form.scholar} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="dept" className="form-control form-select" value={form.dept} onChange={handleChange}>
                  {['CS', 'ECE', 'Mech', 'Civil', 'Chem', 'BioTech', 'Math', 'Physics'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Research Topic *</label>
                <input name="topic" required className="form-control" placeholder="e.g. AI in Healthcare Diagnostics" value={form.topic} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Supervisor Name *</label>
                <input name="supervisor" required className="form-control" placeholder="e.g. Dr. Priya Kumar" value={form.supervisor} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input name="startDate" type="date" className="form-control" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Research Stage</label>
                <select name="stage" className="form-control form-select" value={form.stage} onChange={handleChange}>
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control form-select" value={form.status} onChange={handleChange}>
                  {STATUSES_OPT.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Progress: <strong>{form.progress}%</strong></label>
                <input name="progress" type="range" min={0} max={100} step={5} className="form-control" style={{ padding: '4px 0', cursor: 'pointer' }} value={form.progress} onChange={handleChange} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>
              {editData ? 'Save Changes' : '+ Add Research'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ResearchManagement() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterStage, setFilterStage] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('rms_research')
    if (stored) {
      try { setProjects(JSON.parse(stored)) } catch { setProjects(DEFAULT_RESEARCH) }
    } else {
      setProjects(DEFAULT_RESEARCH)
      localStorage.setItem('rms_research', JSON.stringify(DEFAULT_RESEARCH))
    }
  }, [])

  const saveAll = (updated) => {
    setProjects(updated)
    localStorage.setItem('rms_research', JSON.stringify(updated))
  }

  const handleSave = (formData) => {
    if (editingProject) {
      const updated = projects.map(p => p.id === editingProject.id ? { ...p, ...formData } : p)
      saveAll(updated)
      toast.success('Research project updated!')
      setEditingProject(null)
    } else {
      const newProject = { ...formData, id: Date.now() }
      saveAll([newProject, ...projects])
      toast.success('Research project added!')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this research project?')) {
      saveAll(projects.filter(p => p.id !== id))
      toast.success('Project removed')
    }
  }

  const filtered = projects.filter(p =>
    (p.scholar.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === 'All' || p.status === filterStatus) &&
    (filterStage === 'All' || p.stage === filterStage)
  )

  const avgProgress = projects.length ? Math.round(projects.reduce((a, r) => a + r.progress, 0) / projects.length) : 0

  return (
    <div className="animate-fade">
      {(showModal || editingProject) && (
        <ResearchModal
          editData={editingProject}
          onClose={() => { setShowModal(false); setEditingProject(null) }}
          onSave={handleSave}
        />
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Research Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Monitor all active and completed research projects</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📥 Export</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => setShowModal(true)}>
            + New Research
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Projects', value: projects.length, icon: '🔬', color: 'purple' },
            { label: 'Active', value: projects.filter(r => r.status === 'Active').length, icon: '▶', color: 'green' },
            { label: 'Completed', value: projects.filter(r => r.status === 'Completed').length, icon: '🏆', color: 'blue' },
            { label: 'Avg. Progress', value: `${avgProgress}%`, icon: '📈', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input className="form-control" placeholder="Search research..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control form-select" style={{ width: '150px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {['All', 'Active', 'Completed', 'Discontinued'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="form-control form-select" style={{ width: '190px' }} value={filterStage} onChange={e => setFilterStage(e.target.value)}>
              {['All', ...STAGES].map(s => <option key={s}>{s}</option>)}
            </select>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} projects</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Scholar</th>
                  <th>Research Topic</th>
                  <th>Supervisor</th>
                  <th>Start Date</th>
                  <th>Stage</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: `hsl(${(r.id * 55) % 360},60%,55%)` }}>{r.scholar.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{r.scholar}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', maxWidth: '200px', color: 'var(--text-primary)', fontWeight: 500 }}>{r.topic}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{r.supervisor}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.startDate}</td>
                    <td>
                      <span style={{
                        padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                        background: `${STAGE_COLORS[r.stage] || '#6C63FF'}18`,
                        color: STAGE_COLORS[r.stage] || '#6C63FF',
                      }}>{r.stage}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{
                            width: `${r.progress}%`,
                            background: r.progress === 100 ? '#10B981' : r.progress >= 60 ? '#3B82F6' : '#F59E0B'
                          }} />
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, minWidth: '28px' }}>{r.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${r.status === 'Active' ? 'badge-success' : r.status === 'Completed' ? 'badge-info' : 'badge-danger'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-ghost btn-sm" title="View">👁️</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingProject(r)} title="Edit">✏️</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }} onClick={() => handleDelete(r.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔬</div>
              <h3>No research projects found</h3>
              <p>Try adjusting filters or add a new project.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
