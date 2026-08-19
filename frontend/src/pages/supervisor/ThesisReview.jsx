import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

function UploadThesisModal({ onClose, onUpload, scholars }) {
  const [selectedScholar, setSelectedScholar] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedScholar || !title || !file) {
      toast.error('Please select a scholar, enter thesis title, and choose a file.')
      return
    }
    const scholarObj = scholars.find(s => s.name === selectedScholar)
    if (!scholarObj) {
      toast.error('Selected scholar not found')
      return
    }
    
    onUpload({
      scholarId: scholarObj.id || scholarObj._id,
      title: title,
      file: file
    })
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Upload Scholar Thesis</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Select Scholar *</label>
              <select 
                className="form-control form-select" 
                value={selectedScholar} 
                onChange={e => setSelectedScholar(e.target.value)}
                required
              >
                <option value="">-- Choose Scholar --</option>
                {scholars.map(s => (
                  <option key={s.id || s._id} value={s.name}>{s.name} ({s.dept})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Thesis Title *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter thesis draft title" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Select Thesis File *</label>
              <div 
                onClick={() => document.getElementById('thesisFileInput').click()}
                style={{
                  border: '2px dashed #CBD5E1', borderRadius: 'var(--radius-md)',
                  padding: '24px', textAlign: 'center', cursor: 'pointer',
                  background: '#FAFAFA', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4F46E5'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#CBD5E1'}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                {file ? (
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#10B981' }}>Selected: {file.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Click to change file</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>Click to select thesis draft</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDF format</div>
                  </div>
                )}
                <input 
                  id="thesisFileInput" 
                  type="file" 
                  accept=".pdf"
                  style={{ display: 'none' }} 
                  onChange={e => {
                    if (e.target.files?.[0]) setFile(e.target.files[0])
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>Upload Thesis</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ThesisReview() {
  const [submissions, setSubmissions] = useState([])
  const [scholars, setScholars] = useState([])
  const [search, setSearch] = useState('')
  const [selectedSub, setSelectedSub] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const storedUser = localStorage.getItem('rms_user')
      const supervisorObj = storedUser ? JSON.parse(storedUser) : null
      const supervisorId = supervisorObj?.id || supervisorObj?._id || ''

      const response = await fetch(`/api/thesis?supervisorId=${supervisorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setSubmissions(data)
    } catch (err) {
      toast.error('Failed to load thesis submissions')
    } finally {
      setLoading(false)
    }
  }

  const fetchScholars = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const storedUser = localStorage.getItem('rms_user')
      const supervisorObj = storedUser ? JSON.parse(storedUser) : null
      const supervisorId = supervisorObj?.id || supervisorObj?._id || ''

      const response = await fetch(`/api/users?role=scholar&supervisorId=${supervisorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setScholars(data)
    } catch (err) {
      console.error('Failed to load supervisor scholars')
    }
  }

  useEffect(() => {
    fetchSubmissions()
    fetchScholars()
  }, [])

  const handleAction = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await fetch(`/api/thesis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          remarks: remarks
        })
      })
      if (!response.ok) throw new Error()
      toast.success(`Thesis status updated to ${newStatus}`)
      setSelectedSub(null)
      setRemarks('')
      fetchSubmissions()
    } catch (err) {
      toast.error('Failed to submit thesis review decision')
    }
  }

  const handleUpload = async (newSubmission) => {
    try {
      const token = localStorage.getItem('rms_token')
      const formData = new FormData()
      formData.append('title', newSubmission.title)
      formData.append('scholarId', newSubmission.scholarId)
      formData.append('file', newSubmission.file)

      const response = await fetch('/api/thesis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      if (!response.ok) throw new Error()
      toast.success('Thesis draft uploaded successfully!')
      fetchSubmissions()
    } catch (err) {
      toast.error('Failed to upload thesis draft')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'badge-success'
      case 'Pending': return 'badge-warning'
      case 'Rejected': return 'badge-danger'
      default: return 'badge-gray'
    }
  }

  const filtered = submissions.filter(sub => 
    (sub.scholar || '').toLowerCase().includes(search.toLowerCase()) || 
    (sub.title || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Upload Modal */}
      {showUploadModal && (
        <UploadThesisModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          scholars={scholars}
        />
      )}

      {/* Review Modal */}
      {selectedSub && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Review Thesis Draft</span>
              <button className="modal-close" onClick={() => setSelectedSub(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Scholar</label>
                  <div style={{ fontSize: '13.5px' }}>{selectedSub.scholar}</div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Thesis Title</label>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSub.title}</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Remarks / Feedback</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  placeholder="Enter detailed feedback or required amendments..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger btn-sm" onClick={() => handleAction(selectedSub.id || selectedSub._id, 'Rejected')}>
                Reject Draft
              </button>
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => handleAction(selectedSub.id || selectedSub._id, 'Approved')}>
                ✓ Approve Draft
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Thesis Review</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Evaluate and provide feedback on final thesis drafts</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📥 Export Report</button>
          <button className="btn btn-primary btn-sm" style={{ background: '#0D9488', borderColor: '#0D9488' }} onClick={() => setShowUploadModal(true)}>＋ Upload Thesis</button>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Pending', value: submissions.filter(t => t.status === 'Pending').length, icon: '📚', color: 'blue' },
            { label: 'Total Approved', value: submissions.filter(t => t.status === 'Approved').length, icon: '✅', color: 'green' },
            { label: 'Total Rejected', value: submissions.filter(t => t.status === 'Rejected').length, icon: '❌', color: 'red' },
            { label: 'Total Submissions', value: submissions.length, icon: '🔍', color: 'purple' },
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

        {/* Thesis Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', alignItems: 'start' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Submitted Thesis Drafts</div>
              <input 
                className="form-control" 
                style={{ width: '200px', fontSize: '12.5px', padding: '6px 12px' }} 
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading drafts...</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No thesis drafts submitted yet</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Scholar</th>
                      <th>Thesis Title</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th>Feedback</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((sub, i) => (
                      <tr key={sub.id || sub._id}>
                        <td>{i + 1}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{sub.scholar}</div>
                        </td>
                        <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          <a href={sub.fileUrl ? `${import.meta.env.VITE_API_URL || ''}${sub.fileUrl}` : '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                            {sub.title}
                          </a>
                        </td>
                        <td>{sub.submittedAt}</td>
                        <td><span className={`badge ${getStatusBadge(sub.status)}`}>{sub.status}</span></td>
                        <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '200px' }}>{sub.remarks || '—'}</td>
                        <td>
                          <button className="btn btn-primary btn-sm" onClick={() => setSelectedSub(sub)}>
                            Review
                          </button>
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
    </div>
  )
}
