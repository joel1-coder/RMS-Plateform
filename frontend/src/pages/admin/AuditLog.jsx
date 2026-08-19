import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const SEVERITY_MAP = {
  'Info': { label: 'Info', cls: 'badge-info' },
  'Success': { label: 'Success', cls: 'badge-success' },
  'Warning': { label: 'Warning', cls: 'badge-warning' },
  'Critical': { label: 'Critical', cls: 'badge-danger' },
}

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await fetch(`/api/audit?severity=${filterSeverity === 'All' ? '' : filterSeverity}&search=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setLogs(data)
    } catch {
      toast.error('Failed to load audit logs from system database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filterSeverity, search])

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Audit Log</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track all system actions and events</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => toast.success('CSV export generated successfully')}>📥 Export CSV</button>
          <button className="btn btn-primary btn-sm" onClick={fetchLogs}>🔄 Refresh</button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Events', value: logs.length, icon: '📋', color: 'purple' },
            { label: 'Critical Events', value: logs.filter(l => l.severity === 'Critical').length, icon: '🚨', color: 'red' },
            { label: 'Warnings', value: logs.filter(l => l.severity === 'Warning').length, icon: '⚠️', color: 'orange' },
            { label: 'Success Actions', value: logs.filter(l => l.severity === 'Success').length, icon: '✅', color: 'green' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '--' : s.value}</div>
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
            <select className="form-control form-select" style={{ width: '150px' }} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
              {['All', 'Info', 'Success', 'Warning', 'Critical'].map(s => <option key={s}>{s === 'All' ? 'All Severities' : s}</option>)}
            </select>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{logs.length} events logged</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading logs...</div>
            ) : logs.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No audit logs matched filters</div>
            ) : (
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
                  {logs.map((log, i) => (
                    <tr key={log.id || log._id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{log.user?.charAt(0) || 'S'}</div>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>{log.user}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '13px' }}>{log.action}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px', maxWidth: '380px' }}>{log.detail}</td>
                      <td>
                        <code style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{log.ipAddress}</code>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp || log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${SEVERITY_MAP[log.severity]?.cls || 'badge-gray'}`}>
                          {SEVERITY_MAP[log.severity]?.label || log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pagination">
            <span className="pagination-info">Showing {logs.length} entries</span>
            <button className="page-btn active">1</button>
          </div>
        </div>
      </div>
    </div>
  )
}
