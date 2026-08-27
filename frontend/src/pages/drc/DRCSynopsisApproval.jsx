import { useState } from 'react'
import toast from 'react-hot-toast'

const initialSynopsisSubmissions = [
  { id: 'SYN-2023-401', scholar: 'Aravind Sharma', topic: 'Optimization of Superconducting Qubits using AI', supervisor: 'Dr. Robert Chen', date: 'Oct 24, 2023', status: 'Pending DRC Review', version: 'v1.0' },
  { id: 'SYN-2023-402', scholar: 'Elena Rodriguez', topic: 'Topology in Higher-Dimensional Manifolds', supervisor: 'Prof. Sarah Jenkins', date: 'Oct 22, 2023', status: 'Pending DRC Review', version: 'v1.0' },
  { id: 'SYN-2023-403', scholar: 'Chen Wei', topic: 'Distributed Security Systems in Web3.0', supervisor: 'Dr. Wei Zhang', date: 'Oct 20, 2023', status: 'Approved by DRC', version: 'v1.2' },
  { id: 'SYN-2023-404', scholar: 'Jordan Smith', topic: 'Transformer Models for Real-time Signal Translation', supervisor: 'Prof. Lisa Cuddy', date: 'Oct 18, 2023', status: 'Needs DRC Revision', version: 'v1.1' },
]

export default function DRCSynopsisApproval() {
  const [submissions, setSubmissions] = useState(initialSynopsisSubmissions)
  const [selectedSub, setSelectedSub] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [search, setSearch] = useState('')

  const handleAction = (id, newStatus) => {
    setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub))
    toast.success(`Synopsis status updated to: ${newStatus}`)
    setSelectedSub(null)
    setRemarks('')
  }

  const getStatusBadge = (status) => {
    if (status.includes('Approved')) return 'badge-success'
    if (status.includes('Pending')) return 'badge-warning'
    return 'badge-danger'
  }

  const filtered = submissions.filter(sub =>
    sub.scholar.toLowerCase().includes(search.toLowerCase()) ||
    sub.topic.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Modal */}
      {selectedSub && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Review & Approve Research Synopsis</span>
              <button className="modal-close" onClick={() => setSelectedSub(null)}></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Scholar Name</label>
                  <div style={{ fontSize: '13.5px' }}>{selectedSub.scholar} ({selectedSub.id})</div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Research Title / Topic</label>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSub.topic}</div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Supervisor</label>
                    <div style={{ fontSize: '13.5px' }}>{selectedSub.supervisor}</div>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Submission Date</label>
                    <div style={{ fontSize: '13.5px' }}>{selectedSub.date}</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">DRC Committee Remarks / Feedback *</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  placeholder="Enter detailed feedback, comments, or reason for rejection/revision..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger btn-sm" onClick={() => handleAction(selectedSub.id, 'Needs DRC Revision')}>
                Request Revisions
              </button>
              <button className="btn btn-primary btn-sm" style={{ background: '#174EA6' }} onClick={() => handleAction(selectedSub.id, 'Approved by DRC')}>
                 Approve Synopsis
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Synopsis Approval Workflow</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Review, provide comments, and approve research synopses for PhD registration.</span>
        </div>
        <div className="topbar-actions">
          <input 
            className="form-control" 
            style={{ width: '200px', fontSize: '12.5px' }} 
            placeholder="Search scholars..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Pending DRC Review', value: submissions.filter(s => s.status.includes('Pending')).length, icon: '', color: 'orange' },
            { label: 'Approved DRC', value: submissions.filter(s => s.status.includes('Approved')).length, icon: '', color: 'green' },
            { label: 'Revisions Requested', value: submissions.filter(s => s.status.includes('Needs')).length, icon: '', color: 'red' },
            { label: 'Total Submissions', value: submissions.length, icon: '', color: 'blue' },
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

        {/* Synopsis Table list */}
        <div className="card">
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Synopsis Topic</th>
                  <th>Supervisor</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#174EA6' }}>{sub.scholar.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{sub.scholar}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.id} - {sub.version}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', maxWidth: '240px', fontWeight: 500 }}>{sub.topic}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{sub.supervisor}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{sub.date}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(sub.status)}`}>{sub.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => setSelectedSub(sub)}>Review & Sign</button>
                        <button className="btn btn-ghost btn-sm" title="View Document File"></button>
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
