import { useState } from 'react'
import toast from 'react-hot-toast'

const docs = [
  { id: 1, name: 'Synopsis_v2_Approved.pdf',      category: 'Synopsis',    size: '2.4 MB', uploaded: '2022-05-15', status: 'Verified' },
  { id: 2, name: 'Chapter1_Introduction.pdf',     category: 'Thesis',      size: '4.1 MB', uploaded: '2023-08-10', status: 'Verified' },
  { id: 3, name: 'Chapter2_LiteratureReview.pdf', category: 'Thesis',      size: '6.2 MB', uploaded: '2023-11-20', status: 'Verified' },
  { id: 4, name: 'Chapter3_Methodology.pdf',      category: 'Thesis',      size: '3.8 MB', uploaded: '2024-02-14', status: 'Verified' },
  { id: 5, name: 'Chapter4_Results.pdf',           category: 'Thesis',      size: '5.5 MB', uploaded: '2024-07-10', status: 'Under Review' },
  { id: 6, name: 'Publication_IEEEAccess.pdf',    category: 'Publication',  size: '1.2 MB', uploaded: '2023-09-01', status: 'Verified' },
  { id: 7, name: 'Progress_Report_2024.pdf',      category: 'Report',      size: '0.8 MB', uploaded: '2024-04-30', status: 'Verified' },
  { id: 8, name: 'IRB_Approval.pdf',              category: 'Certificate', size: '0.4 MB', uploaded: '2023-06-01', status: 'Verified' },
  { id: 9, name: 'Anti_Plagiarism_Report.pdf',   category: 'Report',      size: '1.1 MB', uploaded: '2024-07-05', status: 'Pending' },
]

const CATEGORIES = ['All', 'Synopsis', 'Thesis', 'Publication', 'Report', 'Certificate']
const CAT_ICON = { Synopsis: '📋', Thesis: '📚', Publication: '📰', Report: '📊', Certificate: '🏆' }

const STATUS_CLS = { Verified: 'badge-success', 'Under Review': 'badge-warning', Pending: 'badge-info' }

export default function ScholarDocuments() {
  const [docs2, setDocs2] = useState(docs)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)

  const filtered = docs2.filter(d =>
    (filter === 'All' || d.category === filter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    toast.success('File uploaded! Awaiting verification.')
  }

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Documents</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Upload and manage all your research documents</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }}>📤 Upload Document</button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Files',    value: docs2.length, icon: '📁', color: 'purple' },
            { label: 'Verified',       value: docs2.filter(d => d.status === 'Verified').length, icon: '✅', color: 'green' },
            { label: 'Under Review',  value: docs2.filter(d => d.status === 'Under Review').length, icon: '🔍', color: 'orange' },
            { label: 'Pending',       value: docs2.filter(d => d.status === 'Pending').length, icon: '⏳', color: 'blue' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Drop Zone */}
        <div
          style={{
            border: `2px dashed ${dragging ? '#10B981' : 'var(--border)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '24px',
            background: dragging ? '#F0FDF4' : 'var(--bg-card)',
            transition: 'all 0.2s',
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📂</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: dragging ? '#059669' : 'var(--text-primary)' }}>
            {dragging ? 'Drop files here!' : 'Drag & Drop files here'}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>or click to browse — PDF, DOCX, ZIP · max 20MB</div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: '14px', borderColor: '#10B981', color: '#10B981' }}>📤 Choose Files</button>
        </div>

        {/* Filter & Search */}
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input className="form-control" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`}
                  style={filter === cat ? { background: 'linear-gradient(90deg,#10B981,#059669)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' } : {}}>
                  {CAT_ICON[cat] || '📁'} {cat}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} files</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr><th>#</th><th>Document Name</th><th>Category</th><th>Size</th><th>Uploaded</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((doc, i) => (
                  <tr key={doc.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{CAT_ICON[doc.category] || '📄'}</span>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{doc.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-info" style={{ fontSize: '11px' }}>{doc.category}</span></td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{doc.size}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{doc.uploaded}</td>
                    <td><span className={`badge ${STATUS_CLS[doc.status]}`}>{doc.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-ghost btn-sm" title="Preview">👁️</button>
                        <button className="btn btn-secondary btn-sm" title="Download">📥</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }} title="Delete" onClick={() => setDocs2(prev => prev.filter(d => d.id !== doc.id))}>🗑️</button>
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
