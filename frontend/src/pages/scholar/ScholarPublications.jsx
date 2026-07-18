import { useState } from 'react'
import toast from 'react-hot-toast'

const myPubs = [
  { id: 1, title: 'Deep Learning for Medical Image Classification', journal: 'IEEE Access', year: 2023, volume: '11', pages: '12345–12358', doi: '10.1109/ACCESS.2023.123456', type: 'Journal', impactFactor: 3.9, indexed: 'SCI', status: 'Published', citations: 12 },
  { id: 2, title: 'AI-Driven Diagnostics: A Comprehensive Survey', journal: 'IJCA (Int. Journal of Computer Applications)', year: 2023, volume: '185', pages: '1–8', doi: '10.5120/ijca2023923001', type: 'Conference', impactFactor: null, indexed: 'Scopus', status: 'Published', citations: 5 },
  { id: 3, title: 'Federated Learning Approaches in Clinical Settings', journal: 'Springer LNCS (AICNS 2024)', year: 2024, volume: '—', pages: '—', doi: '', type: 'Conference', impactFactor: null, indexed: 'Scopus', status: 'Under Review', citations: 0 },
  { id: 4, title: 'Explainable AI for Diagnostic Decision Support', journal: 'Expert Systems with Applications', year: 2024, volume: '—', pages: '—', doi: '', type: 'Journal', impactFactor: 8.5, indexed: 'SCI', status: 'Draft', citations: 0 },
]

const TYPES = ['All', 'Journal', 'Conference', 'Book Chapter', 'Patent']
const STATUS_CLS = { Published: 'badge-success', 'Under Review': 'badge-warning', Draft: 'badge-gray', Accepted: 'badge-info' }

export default function ScholarPublications() {
  const [pubs, setPubs] = useState(myPubs)
  const [filterType, setFilterType] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const filtered = pubs.filter(p => filterType === 'All' || p.type === filterType)

  return (
    <div className="animate-fade">
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Add Publication</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Paper Title</label>
                  <input className="form-control" placeholder="Full title of the paper" />
                </div>
                <div className="form-group">
                  <label className="form-label">Publication Type</label>
                  <select className="form-control form-select">
                    <option>Journal</option><option>Conference</option><option>Book Chapter</option><option>Patent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Journal / Conference Name</label>
                  <input className="form-control" placeholder="IEEE Access / ICML 2024" />
                </div>
                <div className="form-group">
                  <label className="form-label">Publication Year</label>
                  <input type="number" className="form-control" placeholder="2024" min="2000" max="2030" />
                </div>
                <div className="form-group">
                  <label className="form-label">DOI (if available)</label>
                  <input className="form-control" placeholder="10.xxxx/xxxxx" />
                </div>
                <div className="form-group">
                  <label className="form-label">Indexing</label>
                  <select className="form-control form-select">
                    <option>SCI</option><option>Scopus</option><option>UGC Care</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Impact Factor</label>
                  <input type="number" step="0.1" className="form-control" placeholder="3.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control form-select">
                    <option>Published</option><option>Under Review</option><option>Accepted</option><option>Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => { setShowModal(false); toast.success('Publication added!') }}>Add Publication</button>
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Publications</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage your research publications and citations</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => setShowModal(true)}>
            ＋ Add Publication
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Papers', value: pubs.length, icon: '📰', color: 'purple' },
            { label: 'Published', value: pubs.filter(p => p.status === 'Published').length, icon: '✅', color: 'green' },
            { label: 'Total Citations', value: pubs.reduce((a, p) => a + p.citations, 0), icon: '🔗', color: 'blue' },
            { label: 'SCI Papers', value: pubs.filter(p => p.indexed === 'SCI').length, icon: '⭐', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="filter-bar">
            <div style={{ display: 'flex', gap: '6px' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-ghost'}`}
                  style={filterType === t ? { background: 'linear-gradient(90deg,#10B981,#059669)' } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: 'var(--text-secondary)' }}>{filtered.length} papers</span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((pub, i) => (
              <div key={pub.id} style={{ padding: '18px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'box-shadow 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)', lineHeight: 1.4, flex: 1 }}>{pub.title}</div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <span className={`badge ${STATUS_CLS[pub.status]}`}>{pub.status}</span>
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>{pub.type}</span>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <strong>{pub.journal}</strong> · {pub.year}
                  {pub.volume !== '—' && ` · Vol. ${pub.volume}, pp. ${pub.pages}`}
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {pub.doi && (
                    <span style={{ fontSize: '12px', color: '#3B82F6', cursor: 'pointer' }}>🔗 DOI: {pub.doi}</span>
                  )}
                  <span className={`badge ${pub.indexed === 'SCI' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '11px' }}>
                    {pub.indexed}
                  </span>
                  {pub.impactFactor && <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>IF: {pub.impactFactor}</span>}
                  {pub.citations > 0 && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📖 {pub.citations} citations</span>}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost btn-sm">✏️</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }} onClick={() => setPubs(prev => prev.filter(p => p.id !== pub.id))}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
