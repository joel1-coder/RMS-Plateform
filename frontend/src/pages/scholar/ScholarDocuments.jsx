import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiFetch, apiUrl } from '../../utils/api'

const CATEGORIES = ['All', 'Synopsis', 'Thesis', 'Publication', 'Report', 'Certificate']
const CAT_ICON = { Synopsis: '', Thesis: '', Publication: '', Report: '', Certificate: '', Other: '' }
const STATUS_CLS = { Verified: 'badge-success', Approved: 'badge-success', 'Under Review': 'badge-warning', 'Pending Supervisor Approval': 'badge-warning', Pending: 'badge-info' }

export default function ScholarDocuments() {
  const [docsList, setDocsList] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadCategory, setUploadCategory] = useState('Synopsis')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchDocs = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const [subsRes, pubsRes, thesisRes] = await Promise.all([
        apiFetch('/api/submissions', { headers: { 'Authorization': `Bearer ${token}` } }),
        apiFetch('/api/publication', { headers: { 'Authorization': `Bearer ${token}` } }),
        apiFetch('/api/thesis', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      const aggregated = []

      if (subsRes.ok) {
        const subs = await subsRes.json()
        subs.forEach(s => {
          aggregated.push({
            id: s.id || s._id,
            name: s.originalName || `${s.type === 'synopsis' ? 'Synopsis' : s.type === 'progress_report' ? 'Progress_Report' : 'Document'}_${s.version || 'v1.0'}.pdf`,
            category: s.type === 'synopsis' ? 'Synopsis' : s.type === 'progress_report' ? 'Report' : s.category || 'Report',
            size: s.size || '1.5 MB',
            uploaded: s.submittedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            status: s.status.includes('Approved') ? 'Verified' : s.status.includes('Pending') ? 'Under Review' : 'Pending',
            fileUrl: s.fileUrl,
            rawType: 'submission'
          })
        })
      }

      if (pubsRes.ok) {
        const pubs = await pubsRes.json()
        pubs.forEach(p => {
          if (p.fileUrl) {
            aggregated.push({
              id: p.id || p._id,
              name: p.title ? `${p.title.slice(0, 30)}.pdf` : 'Publication_Document.pdf',
              category: 'Publication',
              size: '1.2 MB',
              uploaded: p.date || new Date().toISOString().slice(0, 10),
              status: p.status === 'Published' ? 'Verified' : 'Under Review',
              fileUrl: p.fileUrl,
              rawType: 'publication'
            })
          }
        })
      }

      if (thesisRes.ok) {
        const theses = await thesisRes.json()
        theses.forEach(t => {
          if (t.fileUrl) {
            aggregated.push({
              id: t.id || t._id,
              name: t.title ? `${t.title.slice(0, 30)}.pdf` : 'Thesis_Draft.pdf',
              category: 'Thesis',
              size: '4.5 MB',
              uploaded: t.submittedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
              status: t.status.includes('Approved') ? 'Verified' : 'Under Review',
              fileUrl: t.fileUrl,
              rawType: 'thesis'
            })
          }
        })
      }

      setDocsList(aggregated)
    } catch (err) {
      console.error('Failed to load documents', err)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const handleUploadSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!uploadFile) {
      toast.error('Please select a file to upload')
      return
    }

    try {
      setUploading(true)
      const token = localStorage.getItem('rms_token')
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('topic', uploadTitle || uploadFile.name)
      formData.append('category', uploadCategory)
      formData.append('status', 'Verified')

      const res = await apiFetch('/api/submissions/document', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (!res.ok) throw new Error()
      toast.success('Document uploaded successfully!')
      setShowModal(false)
      setUploadFile(null)
      setUploadTitle('')
      fetchDocs()
    } catch {
      toast.error('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      try {
        const token = localStorage.getItem('rms_token')
        const formData = new FormData()
        formData.append('file', file)
        formData.append('topic', file.name)
        formData.append('category', 'Certificate')
        formData.append('status', 'Verified')

        const res = await apiFetch('/api/submissions/document', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })

        if (!res.ok) throw new Error()
        toast.success(`Uploaded ${file.name}!`)
        fetchDocs()
      } catch {
        toast.error('Upload failed')
      }
    }
  }

  const handleDelete = async (doc) => {
    if (window.confirm('Delete this document?')) {
      try {
        const token = localStorage.getItem('rms_token')
        if (doc.rawType === 'submission') {
          await apiFetch(`/api/submissions/${doc.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        } else if (doc.rawType === 'publication') {
          await apiFetch(`/api/publication/${doc.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        } else if (doc.rawType === 'thesis') {
          await apiFetch(`/api/thesis/${doc.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        }
        toast.success('Document removed')
        fetchDocs()
      } catch {
        toast.error('Failed to delete document')
      }
    }
  }

  const filtered = docsList.filter(d =>
    (filter === 'All' || d.category === filter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Upload Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Upload Research Document</span>
              <button className="modal-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleUploadSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Document Title / Description</label>
                  <input
                    className="form-control"
                    placeholder="e.g. IRB Approval Certificate, Ethics Clearance"
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control form-select" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}>
                    {['Synopsis', 'Thesis', 'Publication', 'Report', 'Certificate', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Attach File (PDF, DOCX, ZIP)</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={e => setUploadFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)' }}
                >
                  {uploading ? 'Uploading...' : ' Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Documents</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Upload and manage all your research documents</span>
        </div>
        <div className="topbar-actions">
          <button
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)' }}
            onClick={() => setShowModal(true)}
          >
             Upload Document
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Files', value: docsList.length, icon: '', color: 'blue' },
            { label: 'Verified', value: docsList.filter(d => d.status === 'Verified').length, icon: '', color: 'green' },
            { label: 'Under Review', value: docsList.filter(d => d.status === 'Under Review').length, icon: '', color: 'orange' },
            { label: 'Pending', value: docsList.filter(d => d.status === 'Pending').length, icon: '', color: 'blue' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{loading ? '--' : s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Drop Zone */}
        <div
          style={{
            border: `2px dashed ${dragging ? '#1E7D45' : 'var(--border)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '24px',
            background: dragging ? '#E7F4EC' : 'var(--bg-card)',
            transition: 'all 0.2s',
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => setShowModal(true)}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}></div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: dragging ? '#166A3A' : 'var(--text-primary)' }}>
            {dragging ? 'Drop files here!' : 'Drag & Drop files here'}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>or click to browse - PDF, DOCX, ZIP - max 20MB</div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ marginTop: '14px', borderColor: '#1E7D45', color: '#1E7D45' }}
            onClick={(e) => { e.stopPropagation(); setShowModal(true) }}
          >
             Choose Files
          </button>
        </div>

        {/* Filter & Search */}
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon"></span>
              <input className="form-control" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`}
                  style={filter === cat ? { background: 'linear-gradient(90deg,#1E7D45,#166A3A)', boxShadow: '0 2px 8px rgba(30,125,69,0.24)' } : {}}>
                  {CAT_ICON[cat] || ''} {cat}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} files</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading documents...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
                <div>No documents matching the criteria</div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr><th>#</th><th>Document Name</th><th>Category</th><th>Size</th><th>Uploaded</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((doc, i) => (
                    <tr key={doc.id || i}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{CAT_ICON[doc.category] || ''}</span>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>{doc.name}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-info" style={{ fontSize: '11px' }}>{doc.category}</span></td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{doc.size}</td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{doc.uploaded}</td>
                      <td><span className={`badge ${STATUS_CLS[doc.status] || 'badge-info'}`}>{doc.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {doc.fileUrl && (
                            <a
                              href={apiUrl(doc.fileUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              title="Download"
                              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              
                            </a>
                          )}
                          <button className="btn btn-ghost btn-sm" style={{ color: '#B4232A' }} title="Delete" onClick={() => handleDelete(doc)}></button>
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
