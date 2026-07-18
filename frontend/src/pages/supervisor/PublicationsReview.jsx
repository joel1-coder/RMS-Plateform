import { useState } from 'react'
import toast from 'react-hot-toast'

const initialPubs = [
  { id: 1, scholarName: 'Alex Thompson', scholarId: 'SCH-2024-001', title: 'Optimization of Neural Networks', journal: 'IEEE Transactions on Pattern Analysis', indexType: 'SCI', issue: 'Vol. 45, No. 2, pp. 120-135', status: 'Pending' },
  { id: 2, scholarName: 'Sarah Mitchell', scholarId: 'SCH-2023-452', title: 'Sustainable Energy Systems', journal: 'Nature Energy', indexType: 'Scopus', issue: 'Article 2024.11', status: 'Approved' },
  { id: 3, scholarName: 'David Wilson', scholarId: 'SCH-2024-118', title: 'Advanced Materials for Energy Storage', journal: 'Material Research Express', indexType: 'Other', issue: 'Conf. ID 99312', status: 'Pending' },
]

export default function PublicationsReview() {
  const [pubs, setPubs] = useState(initialPubs)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')

  const handleAction = (id, newStatus) => {
    setPubs(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    toast.success(`Publication ${newStatus === 'Approved' ? 'Approved' : 'Verified'}`)
  }

  const filtered = pubs.filter(p => {
    const matchesSearch = p.scholarName.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'All' || p.indexType === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Publications Review</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Verify and approve scholar research publications for graduation credit</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>📥 Export Report</button>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Submissions', value: '128', sub: '+12%', icon: '📰', color: 'purple' },
            { label: 'Pending Review', value: '14', sub: 'Urgent', icon: '⏳', color: 'red' },
            { label: 'Scopus Indexed', value: '84', sub: 'Verified', icon: '🏆', color: 'blue' },
            { label: 'SCI Indexed', value: '32', sub: 'High impact', icon: '⭐', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: '11px', marginTop: '2px' }} className={s.sub === 'Urgent' ? 'text-danger' : 'text-muted'}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table list */}
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                className="form-control" 
                placeholder="Search papers or scholars..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'SCI', 'Scopus', 'Other'].map(type => (
                <button 
                  key={type} 
                  onClick={() => setFilterType(type === 'All' ? 'All' : type)} 
                  className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-ghost'}`}
                  style={filterType === type ? { background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' } : {}}
                >
                  {type === 'All' ? 'All Types' : type}
                </button>
              ))}
            </div>

            <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: 'var(--text-secondary)' }}>{filtered.length} publications</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Paper Title</th>
                  <th>Journal / Conference</th>
                  <th>Index Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{p.scholarName.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.scholarName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.scholarId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13.5px', fontWeight: 600, maxWidth: '280px' }}>{p.title}</td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{p.journal}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.issue}</div>
                    </td>
                    <td>
                      <span className={`badge ${p.indexType === 'SCI' ? 'badge-warning' : p.indexType === 'Scopus' ? 'badge-info' : 'badge-gray'}`}>
                        {p.indexType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleAction(p.id, 'Verified')}>Verify</button>
                        <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => handleAction(p.id, 'Approved')}>Approve</button>
                        <button className="btn btn-ghost btn-sm">👁️</button>
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
