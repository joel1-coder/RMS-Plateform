import { useState } from 'react'
import toast from 'react-hot-toast'

const initialReports = [
  { id: 1, name: 'Arthur Pendragon', role: 'PhD - Quantum Computing', date: 'Oct 24, 2023', progress: 78, remarks: 'Initial data collection for algorithms completed', status: 'Pending' },
  { id: 2, name: 'Morgana Le Fay', role: 'MSc - AI Ethics', date: 'Oct 22, 2023', progress: 100, remarks: 'Final draft of the comprehensive survey paper submitted', status: 'Approved' },
  { id: 3, name: 'Lancelot Du Lac', role: 'PhD - Cybersecurity', date: 'Oct 20, 2023', progress: 30, remarks: 'Encountered significant obstacles with dataset generation', status: 'Needs Revision' },
]

export default function ProgressReports() {
  const [reports, setReports] = useState(initialReports)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterRange, setFilterRange] = useState('30')

  const handleAction = (id, newStatus) => {
    setReports(prev => prev.map(rep => rep.id === id ? { ...rep, status: newStatus } : rep))
    toast.success(`Progress Report ${newStatus}`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'badge-success'
      case 'Pending': return 'badge-warning'
      case 'Needs Revision': return 'badge-danger'
      default: return 'badge-gray'
    }
  }

  const filtered = reports.filter(r => filterStatus === 'All' || r.status === filterStatus)

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Progress Reports</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Assess bi-annual progress reports submitted by scholars</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm"> Export CSV</button>
        </div>
      </div>

      <div className="page-body">
        {/* Filter Section */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Report Status</label>
              <select className="form-control form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Date Range</label>
              <select className="form-control form-select" value={filterRange} onChange={e => setFilterRange(e.target.value)}>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">This Year</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }}>Apply Filters</button>
          </div>
        </div>

        {/* Table of Submissions */}
        <div className="card">
          <div className="card-header" style={{ padding: '12px 20px' }}>
            <span className="card-title">Recent Submissions</span>
            <span style={{ fontSize: '11px', background: '#E8EEF8', color: '#174EA6', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {filtered.filter(r => r.status === 'Pending').length} Active Reports
            </span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Report Date</th>
                  <th>Progress %</th>
                  <th>Remarks</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#1E7D45' }}>{r.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{r.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{r.date}</td>
                    <td>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: '60px' }}>
                          <div className="progress-fill" style={{ width: `${r.progress}%`, background: r.progress >= 75 ? '#1E7D45' : r.progress >= 50 ? '#174EA6' : '#B4232A' }} />
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700 }}>{r.progress}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '240px' }}>{r.remarks}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(r.status)}`}>{r.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {r.status === 'Pending' ? (
                          <>
                            <button className="btn btn-success btn-sm" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => handleAction(r.id, 'Approved')}>Approve</button>
                            <button className="btn btn-danger btn-sm" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => handleAction(r.id, 'Needs Revision')}>Reject</button>
                          </>
                        ) : (
                          <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px', fontSize: '11px' }}>View Details</button>
                        )}
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
