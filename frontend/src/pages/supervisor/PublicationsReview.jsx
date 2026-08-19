import { apiFetch } from '../../utils/api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

/* ── Publication Types ── */
const PUB_TYPES = [
  'Conference Proceeding',
  'Journal Publishing',
  'Chapters',
  'Books Authored',
  'Books Edited',
  'Patent',
  'Copy Rights',
]

const TYPE_ICONS = {
  'Conference Proceeding': '🏛️',
  'Journal Publishing': '📄',
  'Chapters': '📖',
  'Books Authored': '📚',
  'Books Edited': '✏️',
  'Patent': '⚙️',
  'Copy Rights': '©️',
}

function typeDescription(type) {
  const desc = {
    'Conference Proceeding': 'Papers presented at academic conferences',
    'Journal Publishing': 'Articles in peer-reviewed journals (SCI, Scopus…)',
    'Chapters': 'Chapters contributed to edited books',
    'Books Authored': 'Full books written and authored',
    'Books Edited': 'Books edited/compiled from multiple authors',
    'Patent': 'Inventions filed or granted as patents',
    'Copy Rights': 'Registered copyrights for creative/IP works',
  }
  return desc[type] || ''
}

/* ═══════════════════════════════════════════════
   View Publication Details Modal
═══════════════════════════════════════════════ */
function ViewPublicationModal({ pub, onClose, onAction }) {
  const statusColor = { Approved: '#10B981', Verified: '#3B82F6', Pending: '#F59E0B' }
  const rows = [
    { label: 'Scholar Name', value: pub.scholarName },
    { label: 'Scholar ID', value: pub.scholarId },
    { label: 'Paper Title', value: pub.title },
    { label: 'Venue / Journal', value: pub.journal },
    { label: 'Publication Type', value: pub.pubType },
    { label: 'Index Type', value: pub.indexType },
    { label: 'Current Status', value: pub.status },
    { label: 'DOI Link', value: pub.doi || 'None' }
  ]

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <span className="modal-title">Publication Details</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {rows.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ width: '160px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>{r.label}</div>
                <div style={{ flex: 1, fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {r.label === 'Current Status' ? (
                    <span style={{
                      padding: '3px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700,
                      background: statusColor[r.value] ? statusColor[r.value] + '22' : '#F1F5F9',
                      color: statusColor[r.value] || 'var(--text-secondary)',
                      border: `1.5px solid ${statusColor[r.value] || '#CBD5E1'}`,
                    }}>{r.value}</span>
                  ) : r.label === 'Index Type' ? (
                    <span className={`badge ${r.value === 'SCI' ? 'badge-warning' : r.value === 'Scopus' ? 'badge-info' : 'badge-gray'}`}>{r.value}</span>
                  ) : r.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { onAction(pub.id, 'Verified'); onClose() }}
          >
            ✅ Mark Verified
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}
            onClick={() => { onAction(pub.id, 'Approved'); onClose() }}
          >
            🏆 Approve
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════ */
export default function PublicationsReview() {
  const [pubs, setPubs] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [viewPub, setViewPub] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPublications = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch('/api/publication', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      
      const mapped = data.map(p => ({
        id: p.id || p._id,
        scholarName: p.scholar,
        scholarId: p.scholarId,
        title: p.title,
        journal: p.journal || '—',
        indexType: p.pubType === 'Journal Publishing' ? 'SCI' : p.pubType === 'Conference Proceeding' ? 'Scopus' : 'Other',
        issue: p.date ? `Date: ${p.date}` : '',
        status: p.status || 'Pending',
        pubType: p.pubType || 'Journal Publishing',
        doi: p.doi || ''
      }))
      setPubs(mapped)
    } catch (err) {
      toast.error('Failed to load publication submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublications()
  }, [])

  const handleAction = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch(`/api/publication/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error()
      toast.success(`Publication status set to ${newStatus}`)
      fetchPublications()
    } catch (err) {
      toast.error('Failed to submit publication review status')
    }
  }

  const filtered = pubs.filter(p => {
    const matchesSearch = (p.scholarName || '').toLowerCase().includes(search.toLowerCase()) || (p.title || '').toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'All' || p.indexType === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="animate-fade">
      {viewPub && <ViewPublicationModal pub={viewPub} onClose={() => setViewPub(null)} onAction={handleAction} />}

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
            { label: 'Total Submissions', value: pubs.length, sub: 'Global History', icon: '📰', color: 'purple' },
            { label: 'Pending Review', value: pubs.filter(p => p.status === 'Pending' || p.status === 'Submitted').length, sub: 'Awaiting Actions', icon: '⏳', color: 'red' },
            { label: 'Scopus Indexed', value: pubs.filter(p => p.indexType === 'Scopus').length, sub: 'Verified', icon: 'blue' },
            { label: 'SCI Indexed', value: pubs.filter(p => p.indexType === 'SCI').length, sub: 'SCI-E included', icon: '⭐', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '--' : s.value}</div>
                <div className="stat-label">{s.label}</div>
                {s.sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
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
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading submissions...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No publications submitted for review yet</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Scholar Name</th>
                    <th>Paper Title</th>
                    <th>Journal / Conference</th>
                    <th>Type</th>
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
                          <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{p.scholarName?.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.scholarName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13.5px', fontWeight: 600, maxWidth: '240px' }}>{p.title}</td>
                      <td>
                        <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{p.journal}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.issue}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '18px' }} title={p.pubType || 'Journal Publishing'}>
                          {TYPE_ICONS[p.pubType] || '📄'}
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '90px' }}>{p.pubType || 'Journal'}</div>
                      </td>
                      <td>
                        <span className={`badge ${p.indexType === 'SCI' ? 'badge-warning' : p.indexType === 'Scopus' ? 'badge-info' : 'badge-gray'}`}>
                          {p.indexType}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.status === 'Approved' ? 'badge-success' : p.status === 'Verified' ? 'badge-info' : 'badge-warning'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {p.status !== 'Verified' && p.status !== 'Approved' && (
                            <button className="btn btn-secondary btn-sm" onClick={() => handleAction(p.id, 'Verified')}>Verify</button>
                          )}
                          {p.status !== 'Approved' && (
                            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => handleAction(p.id, 'Approved')}>Approve</button>
                          )}
                          <button className="btn btn-ghost btn-sm" title="View Details" onClick={() => setViewPub(p)}>👁️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
