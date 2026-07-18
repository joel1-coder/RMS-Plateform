import { useState } from 'react'
import toast from 'react-hot-toast'

const reports = [
  { id: 1, period: 'Jan – Jun 2022', submittedOn: '2022-06-30', status: 'Approved', remarks: 'Good progress in course work.' },
  { id: 2, period: 'Jul – Dec 2022', submittedOn: '2022-12-28', status: 'Approved', remarks: 'Literature review completed on schedule.' },
  { id: 3, period: 'Jan – Jun 2023', submittedOn: '2023-07-01', status: 'Approved', remarks: 'Data collection and initial experiments done.' },
  { id: 4, period: 'Jul – Dec 2023', submittedOn: '2024-01-02', status: 'Approved', remarks: 'Model development and testing in progress.' },
  { id: 5, period: 'Jan – Jun 2024', submittedOn: '2024-07-01', status: 'Under Review', remarks: '' },
]

export default function ScholarProgress() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="animate-fade">
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Submit Progress Report</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Report Period</label>
                <select className="form-control form-select">
                  <option>Jul 2024 – Dec 2024</option>
                  <option>Jan 2025 – Jun 2025</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Work Done This Period</label>
                <textarea className="form-control" rows={4} placeholder="Describe your research activities, results, and achievements..." />
              </div>
              <div className="form-group">
                <label className="form-label">Plan for Next Period</label>
                <textarea className="form-control" rows={3} placeholder="What do you plan to accomplish next?" />
              </div>
              <div className="form-group">
                <label className="form-label">Publications / Conferences Attended</label>
                <textarea className="form-control" rows={2} placeholder="List any papers published or conferences attended..." />
              </div>
              <div className="form-group">
                <label className="form-label">Attach Report (PDF)</label>
                <input type="file" accept=".pdf" className="form-control" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => { setShowModal(false); toast.success('Progress report submitted!') }}>📤 Submit Report</button>
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Progress Report</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Submit and view your bi-annual progress reports</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => setShowModal(true)}>
            📤 Submit New Report
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Reports',    value: reports.length, icon: '📊', color: 'purple' },
            { label: 'Approved',         value: reports.filter(r => r.status === 'Approved').length, icon: '✅', color: 'green' },
            { label: 'Under Review',     value: reports.filter(r => r.status === 'Under Review').length, icon: '🔍', color: 'orange' },
            { label: 'Next Due',         value: 'Dec 2024', icon: '⏰', color: 'blue' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Next deadline */}
        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid #FCD34D', borderRadius: 'var(--radius-lg)', padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '28px' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#92400E' }}>Upcoming Report Deadline</div>
            <div style={{ fontSize: '13px', color: '#B45309', marginTop: '2px' }}>
              Your next progress report (Jul – Dec 2024) is due on <strong>Dec 31, 2024</strong>. Submit at least 2 weeks before the deadline.
            </div>
          </div>
          <button className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff', border: 'none' }} onClick={() => setShowModal(true)}>Submit Now</button>
        </div>

        {/* History Table */}
        <div className="card">
          <div className="card-header"><div className="card-title">Report History</div></div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr><th>#</th><th>Period</th><th>Submitted On</th><th>Status</th><th>Supervisor Remarks</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.period}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{r.submittedOn}</td>
                    <td><span className={`badge ${r.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '260px' }}>{r.remarks || 'Awaiting review...'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-ghost btn-sm">👁️</button>
                        <button className="btn btn-secondary btn-sm">📥</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header"><div className="card-title">Evaluation Criteria</div></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {[
                { label: 'Research Progress', pct: 70, color: '#6C63FF' },
                { label: 'Publications',       pct: 60, color: '#10B981' },
                { label: 'Timely Submission',  pct: 90, color: '#3B82F6' },
                { label: 'Seminar/Conference', pct: 50, color: '#F59E0B' },
                { label: 'Supervisor Rating',  pct: 85, color: '#EC4899' },
                { label: 'Overall Score',      pct: 75, color: '#10B981' },
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
