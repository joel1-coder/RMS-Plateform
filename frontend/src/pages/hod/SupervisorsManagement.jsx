import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiFetch } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

export default function SupervisorsManagement() {
  const { user } = useAuth()
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSup, setNewSup] = useState({ name: '', email: '', dept: '', specialization: '' })

  const fetchSupervisors = async () => {
    try {
      const token = sessionStorage.getItem('rms_token')
      const deptFilter = user?.dept && user.dept !== 'All' ? `&dept=${user.dept}` : ''
      const [supsRes, scholarsRes] = await Promise.all([
        apiFetch(`/api/users?role=supervisor${deptFilter}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        apiFetch(`/api/users?role=scholar`, { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      
      const sups = await supsRes.json()
      const scholars = await scholarsRes.json()

      const supsWithStats = sups.map(s => {
        const scholarsCount = scholars.filter(sch => sch.assignedSupervisorId === s.id).length
        const maxScholars = 8
        const status = scholarsCount >= maxScholars ? 'At Capacity' : scholarsCount >= maxScholars - 2 ? 'Near Capacity' : 'Available'
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          dept: s.dept,
          specialization: s.profile?.area || 'General',
          scholars: scholarsCount,
          maxScholars,
          status,
          joined: new Date(s.joined || s.createdAt).toLocaleDateString()
        }
      })
      setSupervisors(supsWithStats)
    } catch (err) {
      toast.error('Failed to load supervisors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSupervisors()
  }, [user?.dept])

  const filtered = supervisors.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.dept.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleAdd = async () => {
    if (!newSup.name || !newSup.email || !newSup.dept) { toast.error('Please fill required fields'); return }
    
    try {
      const token = sessionStorage.getItem('rms_token')
      const res = await apiFetch('/api/users', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSup, role: 'supervisor', password: 'password123', status: 'Active' })
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to add supervisor')
      }
      toast.success(`Supervisor ${newSup.name} added successfully!`)
      setShowAddModal(false)
      setNewSup({ name: '', email: '', dept: '', specialization: '' })
      fetchSupervisors()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const statusColor = s => s === 'Available' ? 'badge-success' : s === 'At Capacity' ? 'badge-danger' : 'badge-warning'
  const loadPct = (s, max) => Math.round((s / max) * 100)
  const loadColor = pct => pct >= 90 ? '#B4232A' : pct >= 70 ? '#C89B1E' : '#1E7D45'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" style={{ borderColor: 'rgba(23,78,166,0.18)', borderTopColor: '#174EA6' }} />
    </div>
  )

  return (
    <div className="animate-fade">
      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Add New Supervisor</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" value={newSup.name} onChange={e => setNewSup({ ...newSup, name: e.target.value })} placeholder="Dr. Full Name" /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-control" type="email" value={newSup.email} onChange={e => setNewSup({ ...newSup, email: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Department</label><input className="form-control" value={newSup.dept} onChange={e => setNewSup({ ...newSup, dept: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Specialization</label><input className="form-control" value={newSup.specialization} onChange={e => setNewSup({ ...newSup, specialization: e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }} onClick={handleAdd}>Add Supervisor</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Supervisors Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage faculty supervisors and their scholar allocations</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm"> Export</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }} onClick={() => setShowAddModal(true)}>+ Add Supervisor</button>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Row */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Supervisors', value: supervisors.length, icon: '', color: 'blue' },
            { label: 'Available', value: supervisors.filter(s => s.status === 'Available').length, icon: '', color: 'green' },
            { label: 'At Capacity', value: supervisors.filter(s => s.status === 'At Capacity').length, icon: '', color: 'red' },
            { label: 'Total Scholars', value: supervisors.reduce((sum, s) => sum + s.scholars, 0), icon: '', color: 'blue' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon"></span>
              <input className="form-control" placeholder="Search supervisors..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['All', 'Available', 'Near Capacity', 'At Capacity'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
                  style={filterStatus === s ? { background: 'linear-gradient(90deg,#174EA6,#0A2A66)' } : {}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Supervisor Name</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Scholar Load</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const pct = loadPct(s.scholars, s.maxScholars)
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar avatar-sm" style={{ background: '#174EA6' }}>{s.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '12.5px' }}>{s.dept}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '200px' }}>{s.specialization}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
                            <span>{s.scholars}/{s.maxScholars} Scholars</span>
                            <span style={{ color: loadColor(pct) }}>{pct}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%`, background: loadColor(pct) }} />
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge ${statusColor(s.status)}`}>{s.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn btn-ghost btn-sm"></button>
                          <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }}>Manage</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
