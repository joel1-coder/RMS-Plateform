import { useState } from 'react'
import toast from 'react-hot-toast'

const initialCommittees = [
  { id: 'COM-001', name: 'Computer Science & AI Evaluation Panel', department: 'Computer Science', chairman: 'Dr. Mohan Reddy', membersCount: 5, activeReviews: 3, status: 'Active' },
  { id: 'COM-002', name: 'Biotechnology Synopsis Review Board', department: 'Biotechnology', chairman: 'Dr. Linda Gray', membersCount: 4, activeReviews: 1, status: 'Active' },
  { id: 'COM-003', name: 'Mathematics Research Committee', department: 'Mathematics', chairman: 'Dr. Alan Turing Jr.', membersCount: 3, activeReviews: 0, status: 'Inactive' },
]

const facultyPool = [
  { name: 'Dr. Mohan Reddy', role: 'Professor', dept: 'CS' },
  { name: 'Dr. Alan Turing Jr.', role: 'Associate Professor', dept: 'CS' },
  { name: 'Dr. Linda Gray', role: 'Professor', dept: 'Biotech' },
  { name: 'Prof. Sarah Jenkins', role: 'Associate Professor', dept: 'CS' },
]

export default function CommitteeManagement() {
  const [committees, setCommittees] = useState(initialCommittees)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCom, setNewCom] = useState({ name: '', department: '', chairman: '', members: [] })

  const handleAdd = () => {
    if (!newCom.name || !newCom.department) {
      toast.error('Please fill in name and department fields')
      return
    }
    const created = {
      id: `COM-${(committees.length + 1).toString().padStart(3, '0')}`,
      name: newCom.name,
      department: newCom.department,
      chairman: newCom.chairman || 'Dr. Mohan Reddy',
      membersCount: newCom.members.length || 3,
      activeReviews: 0,
      status: 'Active',
    }
    setCommittees(p => [...p, created])
    toast.success('Research Evaluation Committee created successfully!')
    setShowAddModal(false)
    setNewCom({ name: '', department: '', chairman: '', members: [] })
  }

  const toggleStatus = id => {
    setCommittees(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    toast.success('Committee status toggled successfully!')
  }

  return (
    <div className="animate-fade">
      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Establish New DRC Committee</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Committee Name *</label>
                <input className="form-control" placeholder="e.g. CS VIVA Evaluation Committee" value={newCom.name} onChange={e => setNewCom({...newCom, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Academic Department *</label>
                <input className="form-control" placeholder="e.g. Computer Science" value={newCom.department} onChange={e => setNewCom({...newCom, department: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Chairman / Lead Advisor</label>
                <select className="form-control form-select" value={newCom.chairman} onChange={e => setNewCom({...newCom, chairman: e.target.value})}>
                  {facultyPool.map((f, i) => <option key={i} value={f.name}>{f.name} ({f.dept})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Panel Experts (Check multiple)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  {facultyPool.map((f, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer' }}>
                      <input type="checkbox" onChange={e => {
                        const checked = e.target.checked
                        setNewCom(prev => {
                          const members = checked ? [...prev.members, f.name] : prev.members.filter(m => m !== f.name)
                          return { ...prev, members }
                        })
                      }} />
                      <span>{f.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#0D9488' }} onClick={handleAdd}>Establish Committee</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">DRC Committee Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Establish, edit and assign members to departmental research evaluation boards.</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: '#0D9488' }} onClick={() => setShowAddModal(true)}>
            ＋ Establish Committee
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Committees Table Grid */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">DRC Committees</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Committee Name</th>
                  <th>Department</th>
                  <th>Chairman</th>
                  <th>Members Count</th>
                  <th>Active Reviews</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {committees.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>👥</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{c.name}</div>
                          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>ID: {c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>{c.department}</td>
                    <td style={{ fontSize: '13px', fontWeight: 600 }}>{c.chairman}</td>
                    <td style={{ fontSize: '13px', textAlign: 'center' }}>{c.membersCount} Members</td>
                    <td style={{ fontSize: '13px', textAlign: 'center' }}>
                      <span className={`badge ${c.activeReviews > 0 ? 'badge-warning' : 'badge-gray'}`}>{c.activeReviews} active</span>
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{c.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={() => toggleStatus(c.id)}>
                          Toggle Status
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Edit Members">✏️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
