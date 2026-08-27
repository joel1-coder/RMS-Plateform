import { useState } from 'react'
import toast from 'react-hot-toast'

const supervisors = [
  { id: 'SUP-001', name: 'Dr. Alan Turing Jr.', email: 'a.turing@university.edu', dept: 'Computer Science', specialization: 'Quantum Computing, AI', scholars: 8, maxScholars: 10, status: 'Available', joined: 'Jan 2019' },
  { id: 'SUP-002', name: 'Dr. Linda Gray', email: 'l.gray@university.edu', dept: 'Biotechnology', specialization: 'Molecular Biology, Genomics', scholars: 10, maxScholars: 10, status: 'At Capacity', joined: 'Mar 2017' },
  { id: 'SUP-003', name: 'Dr. Robert Chen', email: 'r.chen@university.edu', dept: 'Renewable Energy', specialization: 'Solar Tech, Energy Storage', scholars: 6, maxScholars: 8, status: 'Available', joined: 'Aug 2020' },
  { id: 'SUP-004', name: 'Dr. Wei Zhang', email: 'w.zhang@university.edu', dept: 'Cybersecurity', specialization: 'Network Security, Cryptography', scholars: 4, maxScholars: 8, status: 'Available', joined: 'Jun 2021' },
  { id: 'SUP-005', name: 'Prof. Lisa Cuddy', email: 'l.cuddy@university.edu', dept: 'Data Science', specialization: 'Machine Learning, Statistics', scholars: 9, maxScholars: 10, status: 'Near Capacity', joined: 'Feb 2016' },
]

export default function SupervisorsManagement() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSup, setNewSup] = useState({ name: '', email: '', dept: '', specialization: '' })

  const filtered = supervisors.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.dept.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleAdd = () => {
    if (!newSup.name || !newSup.email) { toast.error('Please fill required fields'); return }
    toast.success(`Supervisor ${newSup.name} added successfully!`)
    setShowAddModal(false)
    setNewSup({ name: '', email: '', dept: '', specialization: '' })
  }

  const statusColor = s => s === 'Available' ? 'badge-success' : s === 'At Capacity' ? 'badge-danger' : 'badge-warning'
  const loadPct = (s, max) => Math.round((s / max) * 100)
  const loadColor = pct => pct >= 90 ? '#B4232A' : pct >= 70 ? '#C89B1E' : '#1E7D45'

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
