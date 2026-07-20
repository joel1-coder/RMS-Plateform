import { useState } from 'react'
import toast from 'react-hot-toast'

const initialThesisSubmissions = [
  { id: 1, scholarName: 'Ahmed Mansoor', scholarId: 'PH2021008', dept: 'Computer Science', title: 'Deep Learning Architectures for Real-time Signal Processing', date: 'Oct 14, 2023', status: 'Under Review' },
  { id: 2, scholarName: 'Elena Lopez', scholarId: 'PH2022045', dept: 'Data Science', title: 'Ethical Implications of AI-driven Recruitment Systems', date: 'Oct 12, 2023', status: 'Approved' },
  { id: 3, scholarName: 'Rajesh Kumar', scholarId: 'PH2021088', dept: 'Quantum Physics', title: 'Thermal Stability and Entanglement in Non-equilibrium Systems', date: 'Oct 08, 2023', status: 'Revision Required' },
  { id: 4, scholarName: 'Sarah Wong', scholarId: 'PH2022019', dept: 'Molecular Biology', title: 'CRISPR-Cas9 Mediated Gene Editing for Drought-Resistant Crops', date: 'Oct 05, 2023', status: 'Under Review' },
]

export default function ThesisReview() {
  const [submissions, setSubmissions] = useState(initialThesisSubmissions)
  const [search, setSearch] = useState('')
  const [selectedSub, setSelectedSub] = useState(null)
  const [remarks, setRemarks] = useState('')

  const handleAction = (id, newStatus) => {
    setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub))
    toast.success(`Thesis status updated to ${newStatus}`)
    setSelectedSub(null)
    setRemarks('')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'badge-success'
      case 'Under Review': return 'badge-warning'
      case 'Revision Required': return 'badge-warning'
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
              <span className="modal-title">Review Thesis Draft</span>
              <button className="modal-close" onClick={() => setSelectedSub(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Scholar</label>
                  <div style={{ fontSize: '13.5px' }}>{selectedSub.scholarName} ({selectedSub.scholarId}) · {selectedSub.dept}</div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Thesis Title</label>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSub.title}</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Remarks / Feedback</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  placeholder="Enter detailed feedback or required amendments..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger btn-sm" onClick={() => handleAction(selectedSub.id, 'Rejected')}>
                Reject Draft
              </button>
              <button className="btn btn-warning btn-sm" onClick={() => handleAction(selectedSub.id, 'Revision Required')}>
                Request Revisions
              </button>
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => handleAction(selectedSub.id, 'Approved')}>
                ✓ Approve Draft
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Thesis Review</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Evaluate and provide feedback on final thesis drafts</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📥 Export Report</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>＋ New Call for Submissions</button>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Pending', value: '12', sub: '4 from last week', icon: '📚', color: 'blue' },
            { label: 'In Review', value: '08', sub: 'Completion rate: 92%', icon: '🔍', color: 'purple' },
            { label: 'Approved (MTD)', value: '24', sub: 'Completion rate: 92%', icon: '✅', color: 'green' },
            { label: 'Due This Week', value: '03', sub: 'High Priority', icon: '🚨', color: 'red' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                {s.sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Thesis Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', alignItems: 'start' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Submitted Thesis Drafts</div>
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
                    <th>Thesis Title</th>
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
                          <div className="avatar avatar-sm" style={{ background: '#3B82F6' }}>{sub.scholarName.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{sub.scholarName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.dept}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '12.5px', maxWidth: '250px' }}>{sub.title}</td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{sub.date}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(sub.status)}`}>{sub.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSub(sub)}>Review</button>
                          <button className="btn btn-ghost btn-sm" title="Download Draft">📥</button>
                          <button className="btn btn-ghost btn-sm" title="View Logs">📜</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card card-body" style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '8px', color: '#1E40AF' }}>Supervisor Tip</div>
              <p style={{ fontSize: '12px', color: '#1E3A8A', lineHeight: 1.5, marginBottom: '8px' }}>
                Reviewing theses within 5 days of submission increases scholar graduation rates by 12% on average.
              </p>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#3B82F6', cursor: 'pointer' }}>Read academic best practices →</span>
            </div>

            <div className="card card-body">
              <div className="card-title" style={{ fontSize: '13px', marginBottom: '8px' }}>Upcoming Defense Committees</div>
              <button className="btn btn-primary btn-sm" style={{ width: '100%', background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>Manage Committee</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
