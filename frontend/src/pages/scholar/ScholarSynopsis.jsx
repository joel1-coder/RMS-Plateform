import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { apiFetch, apiUrl } from '../../utils/api'

const TIMELINE_STEPS = ['Draft Prepared', 'Supervisor Review', 'Submitted', 'DRC Review', 'Approved']

export default function ScholarSynopsis() {
  const { user } = useAuth()
  const [showUpload, setShowUpload] = useState(false)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [version, setVersion] = useState('v1.0')
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const [subsRes, projRes] = await Promise.all([
        apiFetch('/api/submissions?type=synopsis', { headers: { 'Authorization': `Bearer ${token}` } }),
        apiFetch('/api/research', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      if (subsRes.ok) {
        const subsData = await subsRes.json()
        setSubmissions(subsData)
        if (subsData.length > 0 && subsData[0].topic) {
          setTitle(subsData[0].topic)
        }
      }

      if (projRes.ok) {
        const projData = await projRes.json()
        if (Array.isArray(projData) && projData.length > 0) {
          setProject(projData[0])
          if (!title && projData[0].topic) setTitle(projData[0].topic)
        }
      }
    } catch (err) {
      console.error('Failed to load synopsis data', err)
      toast.error('Failed to load synopsis records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const latest = submissions[0] || null

  // Determine current timeline step
  let currentStep = 0
  let isDone = false
  if (!latest) {
    currentStep = 0
  } else if (latest.status === 'Pending Supervisor Approval') {
    currentStep = 1
  } else if (latest.status === 'Approved by Supervisor') {
    currentStep = 2
  } else if (latest.status === 'Pending DRC Review' || latest.status === 'Needs DRC Revision') {
    currentStep = 3
  } else if (latest.status === 'Approved by DRC' || latest.status === 'Approved') {
    currentStep = 4
    isDone = true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a synopsis PDF file')
      return
    }

    const synopsisTitle = title.trim() || project?.topic || 'Research Synopsis'
    try {
      setSubmitting(true)
      const token = localStorage.getItem('rms_token')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('topic', synopsisTitle)
      formData.append('version', version || `v${submissions.length + 1}.0`)
      formData.append('remarks', remarks)

      const response = await apiFetch('/api/submissions/synopsis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to submit synopsis')
      }

      toast.success('Synopsis submitted successfully!')
      setShowUpload(false)
      setFile(null)
      setRemarks('')
      fetchData()
    } catch (err) {
      toast.error(err.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade">
      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{submissions.length > 0 ? 'Submit Revised Synopsis' : 'Submit Research Synopsis'}</span>
              <button className="modal-close" onClick={() => setShowUpload(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Synopsis Title *</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Artificial Intelligence in Healthcare Diagnostics"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Version</label>
                  <input
                    className="form-control"
                    placeholder="e.g. v1.0, v2.0"
                    value={version}
                    onChange={e => setVersion(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload File (PDF only) *</label>
                  <div
                    style={{
                      border: '2px dashed var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '28px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: file ? '#E7F4EC' : 'transparent',
                      transition: 'border-color 0.2s'
                    }}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('syn-file').click()}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{file ? '' : ''}</div>
                    <div style={{ fontSize: '13px', color: file ? '#166A3A' : 'var(--text-secondary)', fontWeight: file ? 600 : 400 }}>
                      {file ? file.name : 'Click to upload or drag & drop'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, max 15MB</div>
                  </div>
                  <input
                    id="syn-file"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={e => setFile(e.target.files[0])}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Remarks / Cover Note</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Add any notes for your supervisor or DRC committee..."
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)' }}
                >
                  {submitting ? 'Submitting...' : ' Submit Synopsis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Synopsis</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage your research synopsis submissions</span>
        </div>
        <div className="topbar-actions">
          <button
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)' }}
            onClick={() => setShowUpload(true)}
          >
             {submissions.length > 0 ? 'Submit New Version' : 'Submit Synopsis'}
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Current Status Banner */}
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading synopsis status...</div>
        ) : !latest ? (
          <div style={{
            background: 'linear-gradient(135deg, #0A2A66, #061B44)',
            border: '1.5px dashed rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-xl)', padding: '28px 32px', color: '#fff', marginBottom: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(30,125,69,0.18)', color: '#1E7D45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '3px' }}>Synopsis Status</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>No Synopsis Submitted Yet</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                  Please upload your research synopsis to begin the supervisor review and DRC approval process.
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)', border: 'none', boxShadow: '0 4px 14px rgba(30,125,69,0.3)' }}
              onClick={() => setShowUpload(true)}
            >
               Submit Synopsis Now
            </button>
          </div>
        ) : isDone ? (
          <div style={{
            background: 'linear-gradient(135deg, #1E7D45, #166A3A)',
            borderRadius: 'var(--radius-xl)', padding: '28px 32px', color: '#fff', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap'
          }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Synopsis Status</div>
              <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Approved by DRC</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                Your synopsis was approved on <strong>{latest.approvalDate || latest.submittedAt?.slice(0,10) || 'Recently'}</strong>. You may proceed with your research.
              </div>
            </div>
            {latest.fileUrl && (
              <a
                href={apiUrl(latest.fileUrl)}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
              >
                 Download Approved Copy
              </a>
            )}
          </div>
        ) : (
          <div style={{
            background: latest.status.includes('Revision') ? 'linear-gradient(135deg, #9F1E24, #B4232A)' : 'linear-gradient(135deg, #0A2A66, #061B44)',
            borderRadius: 'var(--radius-xl)', padding: '24px 30px', color: '#fff', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              {latest.status.includes('Revision') ? '' : ''}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '3px' }}>Current Synopsis Status</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{latest.status}</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                {latest.remarks ? `Remarks: ${latest.remarks}` : `Submitted on ${latest.submittedAt?.slice(0,10)}. Currently awaiting review.`}
              </div>
            </div>
            {latest.fileUrl && (
              <a
                href={apiUrl(latest.fileUrl)}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', textDecoration: 'none' }}
              >
                 View Submitted File
              </a>
            )}
          </div>
        )}

        {/* Status Timeline */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header"><div className="card-title">Approval Timeline</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              {TIMELINE_STEPS.map((step, i) => {
                const isStepCompleted = latest ? (isDone ? true : i < currentStep) : false
                const isStepActive = latest ? (isDone ? false : i === currentStep) : false

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < TIMELINE_STEPS.length - 1 ? 1 : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: isStepCompleted || isDone ? '#1E7D45' : isStepActive ? '#C89B1E' : 'var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '14px', fontWeight: 700,
                        border: isStepActive ? '3px solid #936C00' : 'none',
                        boxShadow: isStepActive ? '0 0 0 4px rgba(245,158,11,0.2)' : 'none',
                      }}>
                        {isStepCompleted || isDone ? '' : i + 1}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isStepCompleted || isDone ? '#166A3A' : isStepActive ? '#936C00' : 'var(--text-muted)',
                        fontWeight: isStepActive || isStepCompleted || isDone ? 700 : 400,
                        marginTop: '6px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}>
                        {step}
                      </div>
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div style={{
                        flex: 1, height: '2px',
                        background: (isStepCompleted || isDone) && i < currentStep ? '#1E7D45' : 'var(--border)',
                        margin: '0 4px', marginBottom: '18px', transition: 'background 0.5s'
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Synopsis Details */}
          <div className="card">
            <div className="card-header"><div className="card-title">Synopsis Details</div></div>
            <div className="card-body">
              {[
                { label: 'Title', value: latest?.topic || project?.topic || title || 'Not Specified' },
                { label: 'Scholar', value: `${user?.name || 'Scholar'} (${user?.profile?.regNo || 'PhD/2021/CS/042'})` },
                { label: 'Supervisor', value: user?.assignedSupervisor || project?.supervisor || '-' },
                { label: 'Co-Supervisor', value: project?.coSupervisor || user?.profile?.coSupervisor || '-' },
                { label: 'Department', value: user?.dept || project?.dept || '-' },
                { label: 'DRC Meeting Date', value: latest?.drcMeetingDate || '-' },
                { label: 'Approval Date', value: (latest?.status === 'Approved by DRC' || latest?.status === 'Approved') ? (latest.approvalDate || latest.submittedAt?.slice(0, 10) || '-') : '-' },
                { label: 'Current Version', value: latest?.version ? `${latest.version} (${latest.status})` : (submissions.length > 0 ? 'v1.0' : 'Pending Submission') },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: '130px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{f.label}</span>
                  <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', flex: 1, fontWeight: f.label === 'Title' ? 600 : 400 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission History */}
          <div className="card">
            <div className="card-header"><div className="card-title">Submission History</div></div>
            <div className="card-body">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Loading history...</div>
              ) : submissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
                  <div style={{ fontWeight: 600 }}>No submissions yet</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "Submit Synopsis" above to upload your version 1.0.</div>
                </div>
              ) : (
                submissions.map((h, i) => (
                  <div key={h.id || h._id} style={{
                    padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                    marginBottom: '12px',
                    background: (h.status === 'Approved by DRC' || h.status === 'Approved') ? '#E7F4EC' : h.status.includes('Revision') ? '#F9E6E8' : '#FFF6D8'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{h.version || `v${submissions.length - i}.0`}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${
                          (h.status === 'Approved by DRC' || h.status === 'Approved') ? 'badge-success' :
                          h.status === 'Pending Supervisor Approval' ? 'badge-warning' :
                          h.status.includes('Revision') ? 'badge-danger' : 'badge-info'
                        }`}>{h.status}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.submittedAt?.slice(0, 10)}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {h.remarks || 'No remarks provided.'}
                    </div>
                    {h.fileUrl && (
                      <a
                        href={apiUrl(h.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                         Download Document
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
