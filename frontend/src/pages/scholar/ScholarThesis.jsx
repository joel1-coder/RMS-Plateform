import { apiFetch } from '../../utils/api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  'Pending':   { cls: 'badge-warning', icon: '🔍' },
  'Approved':       { cls: 'badge-success', icon: '✅' },
  'Rejected': { cls: 'badge-danger', icon: '❌' },
}

export default function ScholarThesis() {
  const [showUpload, setShowUpload] = useState(false)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [theses, setTheses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTheses = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      // Retrieve the current logged-in user profile
      const storedUser = localStorage.getItem('rms_user')
      const userObj = storedUser ? JSON.parse(storedUser) : null
      const scholarId = userObj?.id || userObj?._id || ''

      const response = await apiFetch(`/api/thesis?scholarId=${scholarId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setTheses(data)
    } catch (err) {
      toast.error('Failed to load thesis submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTheses()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title) {
      toast.error('Thesis title/chapter and file are required')
      return
    }

    try {
      const token = localStorage.getItem('rms_token')
      const formData = new FormData()
      formData.append('title', title)
      formData.append('file', file)

      const response = await apiFetch('/api/thesis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to upload thesis draft')
      }

      toast.success('Thesis draft uploaded successfully!')
      setShowUpload(false)
      setFile(null)
      setTitle('')
      fetchTheses()
    } catch (err) {
      toast.error(err.message || 'An error occurred during file upload')
    }
  }

  const approvedCount = theses.filter(t => t.status === 'Approved').length

  return (
    <div className="animate-fade">
      {showUpload && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Upload Thesis Draft / Chapter</span>
              <button className="modal-close" onClick={() => setShowUpload(false)}>✕</button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Thesis Title or Chapter Name *</label>
                  <input className="form-control" placeholder="e.g. Chapter 1 - Introduction / Final Draft" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload File (PDF) *</label>
                  <div
                    style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => document.getElementById('thesis-file').click()}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{file ? file.name : 'Click to select and upload PDF'}</div>
                  </div>
                  <input id="thesis-file" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }}>
                  📤 Upload Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Thesis Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track your thesis chapters and get supervisor feedback</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => setShowUpload(true)}>
            📤 Upload Thesis Draft
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Submissions',   value: theses.length, icon: '📚', color: 'purple' },
            { label: 'Approved Drafts',     value: approvedCount,  icon: '✅', color: 'green' },
            { label: 'Under Review',        value: theses.filter(t => t.status === 'Pending').length, icon: '🔍', color: 'orange' },
            { label: 'Rejections / Revision', value: theses.filter(t => t.status === 'Rejected').length, icon: '↩', color: 'red' },
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

        {/* Chapters */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header"><div className="card-title">Thesis Draft Submission History</div></div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</div>
            ) : theses.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No thesis drafts uploaded yet</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thesis / Chapter Title</th>
                    <th>Submitted Date</th>
                    <th>Supervisor</th>
                    <th>Status</th>
                    <th>Feedback / Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {theses.map((ch, i) => (
                    <tr key={ch.id || ch._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{ch.title}</td>
                      <td>{ch.submittedAt}</td>
                      <td>{ch.supervisor}</td>
                      <td>
                        <span className={`badge ${STATUS_MAP[ch.status]?.cls || 'badge-gray'}`}>
                          {STATUS_MAP[ch.status]?.icon} {ch.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '250px' }}>
                        {ch.remarks || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <a
                            href={ch.fileUrl ? `${import.meta.env.VITE_API_URL || ''}${ch.fileUrl}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            👁️ View
                          </a>
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
