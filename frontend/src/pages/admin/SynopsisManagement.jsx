import { useState } from 'react'

const synopsisData = [
  { id: 1, scholar: 'Rahul Sharma', title: 'AI in Healthcare Diagnostics', supervisor: 'Dr. Priya Kumar', dept: 'CS', submitted: '2024-06-10', status: 'Approved', drcDate: '2024-06-20', remarks: 'Excellent scope' },
  { id: 2, scholar: 'Neha Patel', title: 'IoT in Smart Agriculture', supervisor: 'Dr. Rajan Mehta', dept: 'ECE', submitted: '2024-06-15', status: 'Pending DRC', drcDate: '2024-07-25', remarks: '' },
  { id: 3, scholar: 'Sonal Joshi', title: 'Deep Learning for NLP', supervisor: 'Dr. Priya Kumar', dept: 'CS', submitted: '2024-07-01', status: 'Under Review', drcDate: '-', remarks: '' },
  { id: 4, scholar: 'Amit Kumar', title: 'Blockchain Supply Chain', supervisor: 'Dr. Sunita Rao', dept: 'CS', submitted: '2024-05-20', status: 'Approved', drcDate: '2024-06-01', remarks: 'Well-defined objectives' },
  { id: 5, scholar: 'Vikram Singh', title: 'Renewable Energy Systems', supervisor: 'Dr. Rajan Mehta', dept: 'Mech', submitted: '2024-04-15', status: 'Approved', drcDate: '2024-05-01', remarks: 'Strong methodology' },
  { id: 6, scholar: 'Pooja Mehta', title: 'Quantum Computing Cryptography', supervisor: 'Dr. A. Kapoor', dept: 'CS', submitted: '2024-07-08', status: 'Revision Required', drcDate: '-', remarks: 'Needs clearer research questions' },
]

const STATUS_COLORS = {
  'Approved': 'badge-success', 'Under Review': 'badge-warning',
  'Pending DRC': 'badge-info', 'Revision Required': 'badge-danger', 'Rejected': 'badge-danger'
}

export default function SynopsisManagement() {
  const [synopses, setSynopses] = useState(synopsisData)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [viewItem, setViewItem] = useState(null)

  const filtered = synopses.filter(s =>
    (s.scholar.toLowerCase().includes(search.toLowerCase()) || s.title.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === 'All' || s.status === filterStatus)
  )

  const changeStatus = (id, status) => setSynopses(prev => prev.map(s => s.id === id ? { ...s, status } : s))

  return (
    <div className="animate-fade">
      {viewItem && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Synopsis Details</span>
              <button className="modal-close" onClick={() => setViewItem(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  ['Scholar', viewItem.scholar], ['Title', viewItem.title], ['Supervisor', viewItem.supervisor],
                  ['Department', viewItem.dept], ['Submitted', viewItem.submitted], ['DRC Meeting', viewItem.drcDate],
                  ['Status', viewItem.status], ['Remarks', viewItem.remarks || 'None'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ width: '110px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0, paddingTop: '2px' }}>{k}</span>
                    <span style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              {viewItem.status === 'Under Review' && <>
                <button className="btn btn-success btn-sm" onClick={() => { changeStatus(viewItem.id, 'Approved'); setViewItem(null) }}>✓ Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => { changeStatus(viewItem.id, 'Revision Required'); setViewItem(null) }}>↩ Request Revision</button>
              </>}
              <button className="btn btn-ghost" onClick={() => setViewItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Synopsis Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track and review research synopsis submissions</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📥 Export</button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Total', value: synopses.length, icon: '📋', color: 'purple' },
            { label: 'Approved', value: synopses.filter(s => s.status === 'Approved').length, icon: '✅', color: 'green' },
            { label: 'Under Review', value: synopses.filter(s => s.status === 'Under Review').length, icon: '🔍', color: 'orange' },
            { label: 'Pending DRC', value: synopses.filter(s => s.status === 'Pending DRC').length, icon: '⏳', color: 'blue' },
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
              <input className="form-control" placeholder="Search synopsis..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control form-select" style={{ width: '170px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {['All', 'Approved', 'Under Review', 'Pending DRC', 'Revision Required'].map(s => <option key={s}>{s}</option>)}
            </select>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} synopsis</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Scholar</th>
                  <th>Synopsis Title</th>
                  <th>Supervisor</th>
                  <th>Submitted</th>
                  <th>DRC Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((syn, i) => (
                  <tr key={syn.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#10B981' }}>{syn.scholar.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{syn.scholar}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{syn.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '12.5px' }}>{syn.title}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{syn.supervisor}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{syn.submitted}</td>
                    <td style={{ fontSize: '12.5px' }}>{syn.drcDate}</td>
                    <td><span className={`badge ${STATUS_COLORS[syn.status]}`}>{syn.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setViewItem(syn)}>👁️</button>
                        {syn.status === 'Under Review' && <>
                          <button className="btn btn-success btn-sm" onClick={() => changeStatus(syn.id, 'Approved')}>✓</button>
                          <button className="btn btn-danger btn-sm" onClick={() => changeStatus(syn.id, 'Revision Required')}>↩</button>
                        </>}
                        <button className="btn btn-ghost btn-sm">📄</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="pagination-info">Showing {filtered.length} entries</span>
            <button className="page-btn active">1</button>
          </div>
        </div>
      </div>
    </div>
  )
}
