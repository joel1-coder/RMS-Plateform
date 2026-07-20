import { useState } from 'react'
import toast from 'react-hot-toast'

const initialSynopsisSubmissions = [
  { id: 1, scholarName: 'Arjun Mehta', scholarId: 'PH2023001', dept: 'Quantum Computing', title: 'Optimization of Superconducting Qubits using AI', date: 'Oct 24, 2023', status: 'Pending', version: 'v1.0' },
  { id: 2, scholarName: 'Sarah Jenkins', scholarId: 'PH2022014', dept: 'Biotechnology', title: 'Genetic Sequencing in Arid Climate Crops', date: 'Oct 21, 2023', status: 'Changes Requested', version: 'v1.1' },
  { id: 3, scholarName: 'Liam Kim', scholarId: 'PH2022055', dept: 'Material Science', title: 'Graphene Applications in High-Density Batteries', date: 'Oct 19, 2023', status: 'Approved', version: 'v2.0' },
  { id: 4, scholarName: 'David Chen', scholarId: 'PH2023023', dept: 'Data Ethics', title: 'Ethical Implications of Predictive Policing in Urban Areas', date: 'Oct 18, 2023', status: 'Pending', version: 'v1.0' },
]

export default function SynopsisReview() {
  const [submissions, setSubmissions] = useState(initialSynopsisSubmissions)
  const [selectedSub, setSelectedSub] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [search, setSearch] = useState('')

  const handleAction = (id, newStatus) => {
    setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub))
    toast.success(`Synopsis status updated to ${newStatus}`)
    setSelectedSub(null)
    setRemarks('')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'badge-success'
      case 'Pending': return 'badge-warning'
      case 'Changes Requested': return 'badge-warning'
      case 'Rejected': return 'badge-danger'
      default: return 'badge-gray'
    }
  }

  const filtered = submissions.filter(sub => 
    sub.scholarName.toLowerCase().includes(search.toLowerCase()) || 
    sub.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Modal */}
      {selectedSub && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Review Synopsis Submission</span>
              <button className="modal-close" onClick={() => setSelectedSub(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Scholar</label>
                  <div style={{ fontSize: '13.5px' }}>{selectedSub.scholarName} ({selectedSub.scholarId}) · {selectedSub.dept}</div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Synopsis Title</label>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSub.title}</div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Version</label>
                    <div style={{ fontSize: '13.5px' }}>{selectedSub.version}</div>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Submitted On</label>
                    <div style={{ fontSize: '13.5px' }}>{selectedSub.date}</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Remarks / Feedback</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  placeholder="Enter detailed feedback or revisions required..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger btn-sm" onClick={() => handleAction(selectedSub.id, 'Rejected')}>
                Reject Synopsis
              </button>
              <button className="btn btn-warning btn-sm" onClick={() => handleAction(selectedSub.id, 'Changes Requested')}>
                Request Changes
              </button>
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => handleAction(selectedSub.id, 'Approved')}>
                ✓ Approve Synopsis
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Synopsis Review Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Review and manage research synopsis submissions from your scholars</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>📥 Export Report</button>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Pending', value: '08', icon: '📋', color: 'blue' },
            { label: 'Approved This Week', value: '14', icon: '✅', color: 'green' },
            { label: 'Average Review Time', value: '2.4 days', icon: '⏳', color: 'orange' },
            { label: 'Scholar Feedback', value: '98%', icon: '⭐', color: 'purple' },
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

        {/* Guidelines and Queue */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start', marginBottom: '20px' }}>
          {/* Submission Queue */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Submission Queue</div>
              <input 
                className="form-control" 
                style={{ width: '200px', fontSize: '12.5px', padding: '6px 12px' }} 
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Scholar Name</th>
                    <th>Synopsis Title</th>
                    <th>Submission Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(sub => (
                    <tr key={sub.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar avatar-sm" style={{ background: '#4F46E5' }}>{sub.scholarName.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{sub.scholarName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.dept}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '12.5px', maxWidth: '220px' }}>{sub.title}</td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{sub.date}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(sub.status)}`}>{sub.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSub(sub)}>Review</button>
                          <button className="btn btn-ghost btn-sm" title="View PDF">📄</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card card-body">
              <div className="card-title" style={{ fontSize: '14px', marginBottom: '8px' }}>Review Guidelines</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                Ensure all submissions follow the Institutional Research Framework (IRF) 2024 standards. Synopses must include a clear hypothesis, methodology, and ethical considerations section.
              </p>
              <button className="btn btn-outline btn-sm" style={{ width: '100%', borderColor: '#6C63FF', color: '#6C63FF' }}>📖 View full guidelines PDF</button>
            </div>

            <div className="card card-body">
              <div className="card-title" style={{ fontSize: '14px', marginBottom: '8px' }}>Upcoming Meetings</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#F8FAFC', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ background: '#EDE9FE', padding: '6px 10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, display: 'block', color: '#6C63FF' }}>OCT</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#6C63FF' }}>27</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px' }}>Arjun Mehta - Final Review</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>14:00 - 15:00 · Virtual Meeting</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
