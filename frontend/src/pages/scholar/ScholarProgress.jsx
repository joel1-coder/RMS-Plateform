import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiFetch, apiUrl } from '../../utils/api'

export default function ScholarProgress() {
  const [reportsList, setReportsList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [period, setPeriod] = useState('Jul 2024 - Dec 2024')
  const [workDone, setWorkDone] = useState('')
  const [planNext, setPlanNext] = useState('')
  const [publications, setPublications] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const res = await apiFetch('/api/submissions?type=progress_report', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setReportsList(data)
    } catch {
      toast.error('Failed to load progress reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please attach your progress report PDF')
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem('rms_token')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('topic', `Bi-Annual Progress Report (${period})`)
      formData.append('period', period)
      formData.append('workDone', workDone)
      formData.append('planNext', planNext)
      formData.append('remarks', publications ? `Publications: ${publications}` : '')

      const res = await apiFetch('/api/submissions/progress', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Submission failed')
      }

      toast.success('Progress report submitted successfully!')
      setShowModal(false)
      setWorkDone('')
      setPlanNext('')
      setPublications('')
      setFile(null)
      fetchReports()
    } catch (err) {
      toast.error(err.message || 'Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  const approvedCount = reportsList.filter(r => r.status.includes('Approved')).length
  const underReviewCount = reportsList.filter(r => r.status.includes('Pending') || r.status.includes('Review')).length

  return (
    <div className="animate-fade">
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Submit Bi-Annual Progress Report</span>
              <button className="modal-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Report Period *</label>
                  <select className="form-control form-select" value={period} onChange={e => setPeriod(e.target.value)}>
                    <option>Jul 2024 - Dec 2024</option>
                    <option>Jan 2025 - Jun 2025</option>
                    <option>Jul 2025 - Dec 2025</option>
                    <option>Jan 2026 - Jun 2026</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Work Done This Period *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Describe your research activities, experiment results, and achievements..."
                    value={workDone}
                    onChange={e => setWorkDone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Plan for Next Period</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="What milestones do you plan to accomplish in the upcoming semester?"
                    value={planNext}
                    onChange={e => setPlanNext(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Publications / Conferences Attended</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="List any papers published or conferences attended..."
                    value={publications}
                    onChange={e => setPublications(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Attach Signed Report (PDF only) *</label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="form-control"
                    onChange={e => setFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)' }}
                >
                  {submitting ? 'Submitting...' : ' Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Progress Report</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Submit and view your bi-annual progress reports</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)' }} onClick={() => setShowModal(true)}>
             Submit New Report
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Reports', value: reportsList.length, icon: '', color: 'blue' },
            { label: 'Approved', value: approvedCount, icon: '', color: 'green' },
            { label: 'Under Review', value: underReviewCount, icon: '', color: 'orange' },
            { label: 'Next Due', value: 'Dec 2024', icon: '', color: 'blue' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{loading ? '--' : s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Next deadline */}
        <div style={{ background: 'linear-gradient(135deg, #FFF6D8, #FDE68A)', border: '1px solid #FCD34D', borderRadius: 'var(--radius-lg)', padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '28px' }}></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#936C00' }}>Upcoming Report Deadline</div>
            <div style={{ fontSize: '13px', color: '#936C00', marginTop: '2px' }}>
              Your next progress report (Jul - Dec 2024) is due on <strong>Dec 31, 2024</strong>. Submit at least 2 weeks before the deadline.
            </div>
          </div>
          <button className="btn btn-sm" style={{ background: '#C89B1E', color: '#fff', border: 'none' }} onClick={() => setShowModal(true)}>Submit Now</button>
        </div>

        {/* History Table */}
        <div className="card">
          <div className="card-header"><div className="card-title">Report History</div></div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>Loading reports...</div>
            ) : reportsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
                <div>No progress reports submitted yet.</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "Submit New Report" above to file your first bi-annual review.</div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr><th>#</th><th>Period</th><th>Submitted On</th><th>Status</th><th>Supervisor Remarks</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {reportsList.map((r, i) => (
                    <tr key={r.id || r._id || i}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.period || r.topic}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{r.submittedAt?.slice(0, 10)}</td>
                      <td>
                        <span className={`badge ${
                          r.status.includes('Approved') ? 'badge-success' :
                          r.status.includes('Pending') ? 'badge-warning' : 'badge-info'
                        }`}>{r.status}</span>
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '260px' }}>{r.remarks || 'Awaiting review...'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {r.fileUrl && (
                            <a
                              href={apiUrl(r.fileUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              title="Download"
                              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                            >
                              
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

        {/* Evaluation Criteria */}
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header"><div className="card-title">Evaluation Criteria</div></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {[
                { label: 'Research Progress', pct: 70, color: '#174EA6' },
                { label: 'Publications',       pct: 60, color: '#1E7D45' },
                { label: 'Timely Submission',  pct: 90, color: '#174EA6' },
                { label: 'Seminar/Conference', pct: 50, color: '#C89B1E' },
                { label: 'Supervisor Rating',  pct: 85, color: '#B4232A' },
                { label: 'Overall Score',      pct: 75, color: '#1E7D45' },
              ].map((c, i) => (
                <div key={i} style={{ padding: '14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: c.color }}>{c.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
