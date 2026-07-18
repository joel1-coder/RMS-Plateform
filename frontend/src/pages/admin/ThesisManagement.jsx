import { useState } from 'react'

const thesisData = [
  { id: 1, scholar: 'Rahul Sharma', title: 'Artificial Intelligence in Healthcare Diagnostics: A Deep Learning Approach', supervisor: 'Dr. Priya Kumar', dept: 'CS', submitted: '2024-07-01', status: 'Under Review', version: 'v1.2', pages: 210 },
  { id: 2, scholar: 'Amit Kumar', title: 'Blockchain Technology for Transparent Supply Chain Management', supervisor: 'Dr. Sunita Rao', dept: 'CS', submitted: '2024-06-20', status: 'Approved', version: 'v2.0', pages: 185 },
  { id: 3, scholar: 'Sonal Joshi', title: 'Deep Learning Approaches to Natural Language Processing', supervisor: 'Dr. Priya Kumar', dept: 'CS', submitted: '2024-07-10', status: 'Revision Required', version: 'v1.0', pages: 195 },
  { id: 4, scholar: 'Neha Patel', title: 'IoT-based Smart Agriculture System for Crop Monitoring', supervisor: 'Dr. Rajan Mehta', dept: 'ECE', submitted: '2024-07-05', status: 'Under Review', version: 'v1.1', pages: 175 },
  { id: 5, scholar: 'Vikram Singh', title: 'Renewable Energy Integration in Urban Grid Systems', supervisor: 'Dr. Rajan Mehta', dept: 'Mech', submitted: '2024-06-15', status: 'Approved', version: 'v3.0', pages: 220 },
  { id: 6, scholar: 'Pooja Mehta', title: 'Quantum Computing Applications in Cryptography', supervisor: 'Dr. A. Kapoor', dept: 'CS', submitted: '2024-07-12', status: 'Submitted', version: 'v1.0', pages: 165 },
]

const STATUS_COLORS = {
  'Submitted': 'badge-info', 'Under Review': 'badge-warning',
  'Approved': 'badge-success', 'Revision Required': 'badge-danger', 'Rejected': 'badge-danger'
}

export default function ThesisManagement() {
  const [theses, setTheses] = useState(thesisData)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterDept, setFilterDept] = useState('All')

  const filtered = theses.filter(t =>
    (t.scholar.toLowerCase().includes(search.toLowerCase()) || t.title.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === 'All' || t.status === filterStatus) &&
    (filterDept === 'All' || t.dept === filterDept)
  )

  const changeStatus = (id, newStatus) => {
    setTheses(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Thesis Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Review and manage thesis submissions</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📥 Export</button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            { label: 'Total', value: theses.length, icon: '📚', color: 'purple' },
            { label: 'Submitted', value: theses.filter(t => t.status === 'Submitted').length, icon: '📤', color: 'blue' },
            { label: 'Under Review', value: theses.filter(t => t.status === 'Under Review').length, icon: '🔍', color: 'orange' },
            { label: 'Approved', value: theses.filter(t => t.status === 'Approved').length, icon: '✅', color: 'green' },
            { label: 'Revision Needed', value: theses.filter(t => t.status === 'Revision Required').length, icon: '✏️', color: 'red' },
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
              <input className="form-control" placeholder="Search scholar or thesis..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control form-select" style={{ width: '170px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {['All', 'Submitted', 'Under Review', 'Approved', 'Revision Required'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="form-control form-select" style={{ width: '150px' }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              {['All', 'CS', 'ECE', 'Mech', 'Civil'].map(d => <option key={d}>{d}</option>)}
            </select>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} thesis</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Scholar</th>
                  <th>Thesis Title</th>
                  <th>Supervisor</th>
                  <th>Submitted</th>
                  <th>Pages</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((thesis, i) => (
                  <tr key={thesis.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{thesis.scholar.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{thesis.scholar}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{thesis.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: '260px', fontSize: '12.5px' }}>{thesis.title}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{thesis.supervisor}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{thesis.submitted}</td>
                    <td style={{ fontSize: '12.5px' }}>{thesis.pages}</td>
                    <td><span className="badge badge-gray">{thesis.version}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[thesis.status]}`}>{thesis.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary btn-sm" title="View">👁️</button>
                        {thesis.status === 'Under Review' && <>
                          <button className="btn btn-success btn-sm" onClick={() => changeStatus(thesis.id, 'Approved')} title="Approve">✓</button>
                          <button className="btn btn-danger btn-sm" onClick={() => changeStatus(thesis.id, 'Revision Required')} title="Request Revision">↩</button>
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
            {[1, 2].map(p => <button key={p} className={`page-btn${p === 1 ? ' active' : ''}`}>{p}</button>)}
          </div>
        </div>
      </div>
    </div>
  )
}
