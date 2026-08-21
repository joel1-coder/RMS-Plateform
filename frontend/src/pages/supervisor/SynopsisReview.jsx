import { useState, useEffect } from 'react'
import { apiFetch, apiUrl } from '../../utils/api'
import toast from 'react-hot-toast'

export default function SynopsisReview() {
  const [submissions, setSubmissions] = useState([])
  const [selectedSub, setSelectedSub] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('rms_token')
      const res = await apiFetch('/api/submissions?type=synopsis', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSubmissions(data)
    } catch {
      toast.error('Failed to load synopsis submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleAction = async (id, newStatus, defaultRemark) => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('rms_token')
      const finalRemarks = remarks || defaultRemark

      const res = await apiFetch(`/api/submissions/synopsis/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          remarks: finalRemarks
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Status update failed')
      }

      if (newStatus === 'Pending DRC Review') {
        toast.success('✓ Synopsis approved! Forwarded to DRC committee for review.')
      } else if (newStatus === 'Changes Requested') {
        toast.success('Revisions requested from scholar.')
      } else {
        toast.success(`Synopsis status updated: ${newStatus}`)
      }

      setSelectedSub(null)
      setRemarks('')
      fetchSubmissions()
    } catch (err) {
      toast.error(err.message || 'Failed to update synopsis review status')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    if (status.includes('Approved') || status.includes('Verified')) return 'badge-success'
    if (status.includes('DRC Review')) return 'badge-info'
    if (status.includes('Pending') || status.includes('Supervisor Review')) return 'badge-warning'
    if (status.includes('Changes') || status.includes('Revision')) return 'badge-warning'
    if (status.includes('Rejected')) return 'badge-danger'
    return 'badge-gray'
  }

  const filtered = submissions.filter(sub =>
    (sub.scholarName || '').toLowerCase().includes(search.toLowerCase()) ||
    (sub.topic || sub.title || '').toLowerCase().includes(search.toLowerCase())
  )

  const pendingCount = submissions.filter(s => s.status.includes('Pending Supervisor') || s.status === 'Pending' || s.status === 'Draft Prepared').length
  const forwardedCount = submissions.filter(s => s.status.includes('DRC') || s.status.includes('Approved')).length
  const revisionCount = submissions.filter(s => s.status.includes('Changes') || s.status.includes('Revision') || s.status.includes('Rejected')).length

  return (
    <div className="animate-fade">
      {/* Modal */}
      {selectedSub && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Review Synopsis Submission</span>
              <button className="modal-close" onClick={() => setSelectedSub(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Scholar</label>
                  <div style={{ fontSize: '13.5px' }}>
                    {selectedSub.scholarName} {selectedSub.scholarRegNo ? `(${selectedSub.scholarRegNo})` : ''} · {selectedSub.scholarDept || 'Computer Science'}
                  </div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Synopsis Title</label>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSub.topic || selectedSub.title}</div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Version</label>
                    <div style={{ fontSize: '13.5px' }}>{selectedSub.version || 'v1.0'}</div>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Submitted On</label>
                    <div style={{ fontSize: '13.5px' }}>{selectedSub.submittedAt ? selectedSub.submittedAt.slice(0, 10) : 'Recent'}</div>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Current Status</label>
                    <div><span className={`badge ${getStatusBadge(selectedSub.status)}`}>{selectedSub.status}</span></div>
                  </div>
                </div>
                {selectedSub.fileUrl && (
                  <div>
                    <a
                      href={apiUrl(selectedSub.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}
                    >
                      📄 Download & Read Synopsis PDF
                    </a>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Review Remarks / Feedback *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Enter detailed review feedback or revisions required for the scholar / DRC..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn btn-danger btn-sm"
                disabled={actionLoading}
                onClick={() => handleAction(selectedSub.id, 'Rejected', 'Rejected by supervisor.')}
              >
                ✕ Reject
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-warning btn-sm"
                  disabled={actionLoading}
                  onClick={() => handleAction(selectedSub.id, 'Changes Requested', 'Changes requested by supervisor.')}
                >
                  📝 Request Changes
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }}
                  disabled={actionLoading}
                  onClick={() => handleAction(selectedSub.id, 'Pending DRC Review', 'Approved by supervisor. Forwarded to DRC committee.')}
                >
                  {actionLoading ? 'Processing...' : '✓ Approve & Forward to DRC'}
                </button>
                <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Synopsis Review Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Review research synopsis submissions from your assigned scholars</span>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Pending Your Review', value: loading ? '--' : pendingCount, icon: '📋', color: 'blue' },
            { label: 'Forwarded to DRC', value: loading ? '--' : forwardedCount, icon: '✅', color: 'green' },
            { label: 'Revisions Requested', value: loading ? '--' : revisionCount, icon: '⏳', color: 'orange' },
            { label: 'Total Submissions', value: loading ? '--' : submissions.length, icon: '📁', color: 'purple' },
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

        {/* Guidelines and Queue */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start', marginBottom: '20px' }}>
          {/* Submission Queue */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Submission Queue</div>
              <input
                className="form-control"
                style={{ width: '200px', fontSize: '12.5px', padding: '6px 12px' }}
                placeholder="Search by scholar or title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading submissions...</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                  <div>No synopsis submissions found for your scholars.</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>When an assigned scholar submits their synopsis, it will appear here for your review.</div>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Scholar Name</th>
                      <th>Synopsis Title</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(sub => (
                      <tr key={sub.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="avatar avatar-sm" style={{ background: '#4F46E5' }}>{(sub.scholarName || 'S').charAt(0)}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '13px' }}>{sub.scholarName}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.scholarDept || 'Computer Science'} {sub.scholarRegNo ? `(${sub.scholarRegNo})` : ''}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: '12.5px', maxWidth: '220px', fontWeight: 500 }}>{sub.topic || sub.title}</td>
                        <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{sub.submittedAt ? sub.submittedAt.slice(0, 10) : 'Recent'}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(sub.status)}`}>{sub.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSub(sub)}>
                              Review
                            </button>
                            {sub.fileUrl && (
                              <a
                                href={apiUrl(sub.fileUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-ghost btn-sm"
                                title="Download PDF"
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                              >
                                📄
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card card-body">
              <div className="card-title" style={{ fontSize: '14px', marginBottom: '8px' }}>Review & Approval Workflow</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                1. <strong>Supervisor Review:</strong> Scholar synopsis is reviewed by supervisor first.<br />
                2. <strong>DRC Forwarding:</strong> Upon supervisor approval, synopsis transitions to <em>Pending DRC Review</em> for DRC committee agenda.<br />
                3. <strong>DRC Final Approval:</strong> The DRC conducts the meeting and awards final institutional clearance.
              </p>
            </div>

            <div className="card card-body">
              <div className="card-title" style={{ fontSize: '14px', marginBottom: '8px' }}>Standards Checklist</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                ✓ Clear problem formulation<br />
                ✓ Comprehensive literature summary<br />
                ✓ Proposed research methodology<br />
                ✓ Anti-plagiarism index within bounds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
