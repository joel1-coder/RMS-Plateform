import { useState } from 'react'

const logs = [
  { id: 1, user: 'Admin', action: 'User Created', detail: 'Created account for Rahul Sharma (Scholar)', ip: '192.168.1.10', time: '2024-07-17 23:01:45', severity: 'info' },
  { id: 2, user: 'Dr. Priya Kumar', action: 'Synopsis Approved', detail: 'Approved synopsis ID #SYN-2024-045', ip: '192.168.1.22', time: '2024-07-17 22:45:12', severity: 'success' },
  { id: 3, user: 'Admin', action: 'Settings Updated', detail: 'Changed SMTP configuration', ip: '192.168.1.10', time: '2024-07-17 21:30:00', severity: 'warning' },
  { id: 4, user: 'Neha Patel', action: 'Login Failed', detail: 'Invalid credentials attempt (3rd try)', ip: '10.0.0.55', time: '2024-07-17 20:15:33', severity: 'danger' },
  { id: 5, user: 'Prof. Anita Verma', action: 'Viva Scheduled', detail: 'Scheduled viva for Amit Kumar on 2024-08-10', ip: '192.168.1.33', time: '2024-07-17 18:00:00', severity: 'info' },
  { id: 6, user: 'Admin', action: 'User Deactivated', detail: 'Deactivated account for Sonal Joshi', ip: '192.168.1.10', time: '2024-07-17 17:22:10', severity: 'warning' },
  { id: 7, user: 'Dr. Rajan Mehta', action: 'Thesis Rejected', detail: 'Returned thesis draft to scholar for revision', ip: '192.168.1.45', time: '2024-07-17 16:10:00', severity: 'danger' },
  { id: 8, user: 'Admin', action: 'Report Generated', detail: 'Generated monthly progress report (July 2024)', ip: '192.168.1.10', time: '2024-07-17 14:05:00', severity: 'success' },
  { id: 9, user: 'Ms. Deepa Nair', action: 'Book Issued', detail: 'Issued research material to Rahul Sharma', ip: '192.168.1.55', time: '2024-07-17 11:30:00', severity: 'info' },
  { id: 10, user: 'Dr. Mohan Reddy', action: 'DRC Meeting', detail: 'Scheduled DRC review for CS Dept on 2024-07-25', ip: '192.168.1.66', time: '2024-07-17 10:00:00', severity: 'info' },
]

const ACTIONS = ['All', 'User Created', 'Login Failed', 'Settings Updated', 'Thesis Rejected', 'Synopsis Approved', 'Viva Scheduled']

const SEVERITY_MAP = {
  info: { label: 'Info', cls: 'badge-info' },
  success: { label: 'Success', cls: 'badge-success' },
  warning: { label: 'Warning', cls: 'badge-warning' },
  danger: { label: 'Critical', cls: 'badge-danger' },
}

export default function AuditLog() {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('All')
  const [filterSeverity, setFilterSeverity] = useState('All')

  const filtered = logs.filter(l => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase())
    const matchAction = filterAction === 'All' || l.action === filterAction
    const matchSeverity = filterSeverity === 'All' || l.severity === filterSeverity
    return matchSearch && matchAction && matchSeverity
  })

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Audit Log</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track all system actions and events</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📥 Export CSV</button>
          <button className="btn btn-primary btn-sm">🔄 Refresh</button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Total Events', value: logs.length, icon: '📋', color: 'purple' },
            { label: 'Critical', value: logs.filter(l => l.severity === 'danger').length, icon: '🚨', color: 'red' },
            { label: 'Warnings', value: logs.filter(l => l.severity === 'warning').length, icon: '⚠️', color: 'orange' },
            { label: 'Today', value: logs.length, icon: '📅', color: 'blue' },
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
              <input className="form-control" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control form-select" style={{ width: '160px' }} value={filterAction} onChange={e => setFilterAction(e.target.value)}>
              {ACTIONS.map(a => <option key={a}>{a}</option>)}
            </select>
            <select className="form-control form-select" style={{ width: '130px' }} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
              {['All', 'info', 'success', 'warning', 'danger'].map(s => <option key={s}>{s === 'All' ? 'All Severity' : SEVERITY_MAP[s].label}</option>)}
            </select>
            <input type="date" className="form-control" style={{ width: '150px' }} defaultValue="2024-07-17" />
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} events</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Detail</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{log.user.charAt(0)}</div>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{log.user}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '13px' }}>{log.action}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px', maxWidth: '280px' }}>{log.detail}</td>
                    <td>
                      <code style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{log.ip}</code>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>{log.time}</td>
                    <td>
                      <span className={`badge ${SEVERITY_MAP[log.severity].cls}`}>
                        {SEVERITY_MAP[log.severity].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span className="pagination-info">Showing {filtered.length} of {logs.length} entries</span>
            {[1, 2, 3, 4].map(p => (
              <button key={p} className={`page-btn${p === 1 ? ' active' : ''}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
