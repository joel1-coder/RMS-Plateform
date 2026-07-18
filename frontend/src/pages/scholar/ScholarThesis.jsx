import { useState } from 'react'
import toast from 'react-hot-toast'

const chapters = [
  { no: 1, title: 'Introduction',                    pages: 32, status: 'Approved',  feedback: 'Well structured, clear objectives.' },
  { no: 2, title: 'Literature Review',               pages: 45, status: 'Approved',  feedback: 'Comprehensive coverage, minor formatting fixes required.' },
  { no: 3, title: 'Research Methodology',            pages: 38, status: 'Approved',  feedback: 'Methodology is sound and reproducible.' },
  { no: 4, title: 'Experimental Results & Analysis', pages: 42, status: 'Under Review', feedback: 'Awaiting supervisor review.' },
  { no: 5, title: 'Discussion & Conclusion',         pages: 0,  status: 'Not Submitted', feedback: '' },
  { no: 6, title: 'References & Bibliography',       pages: 0,  status: 'Not Submitted', feedback: '' },
]

const STATUS_MAP = {
  'Approved':       { cls: 'badge-success', icon: '✅' },
  'Under Review':   { cls: 'badge-warning', icon: '🔍' },
  'Not Submitted':  { cls: 'badge-gray',    icon: '⭕' },
  'Revision Required': { cls: 'badge-danger', icon: '↩' },
}

export default function ScholarThesis() {
  const [showUpload, setShowUpload] = useState(false)
  const [file, setFile] = useState(null)
  const totalPages = chapters.reduce((a, c) => a + c.pages, 0)
  const approved = chapters.filter(c => c.status === 'Approved').length

  return (
    <div className="animate-fade">
      {showUpload && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Upload Chapter / Thesis Draft</span>
              <button className="modal-close" onClick={() => setShowUpload(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Chapter</label>
                <select className="form-control form-select">
                  {chapters.map(c => <option key={c.no}>Chapter {c.no} – {c.title}</option>)}
                  <option>Full Thesis Draft</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Version</label>
                <input className="form-control" placeholder="e.g. v1.0" />
              </div>
              <div className="form-group">
                <label className="form-label">Upload File (PDF)</label>
                <div
                  style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => document.getElementById('thesis-file').click()}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{file ? file.name : 'Click to upload PDF'}</div>
                </div>
                <input id="thesis-file" type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes for Supervisor</label>
                <textarea className="form-control" rows={2} placeholder="Any specific areas to review..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => { setShowUpload(false); toast.success('Chapter uploaded successfully!') }}>
                📤 Upload Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Thesis</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track your thesis chapters and get supervisor feedback</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📄 Download Draft</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => setShowUpload(true)}>
            📤 Upload Chapter
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Chapters',   value: chapters.length, icon: '📚', color: 'purple' },
            { label: 'Approved',         value: approved,         icon: '✅', color: 'green' },
            { label: 'Under Review',     value: chapters.filter(c => c.status === 'Under Review').length, icon: '🔍', color: 'orange' },
            { label: 'Pages Written',    value: totalPages,       icon: '📝', color: 'blue' },
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

        {/* Thesis Progress Bar */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Overall Thesis Completion</div>
              <div className="card-subtitle">{approved} of {chapters.length} chapters approved</div>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#10B981' }}>{Math.round((approved / chapters.length) * 100)}%</span>
          </div>
          <div style={{ padding: '16px 24px' }}>
            <div className="progress-bar" style={{ height: '10px' }}>
              <div className="progress-fill" style={{ width: `${(approved / chapters.length) * 100}%`, background: 'linear-gradient(90deg,#10B981,#059669)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Start</span>
              <span>50%</span>
              <span>Final Submission</span>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header"><div className="card-title">Chapter-wise Status</div></div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ch.</th><th>Title</th><th>Pages</th><th>Status</th><th>Supervisor Feedback</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map(ch => (
                  <tr key={ch.no}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '16px' }}>{ch.no}</td>
                    <td style={{ fontWeight: 600 }}>{ch.title}</td>
                    <td>{ch.pages > 0 ? ch.pages : '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_MAP[ch.status].cls}`}>
                        {STATUS_MAP[ch.status].icon} {ch.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '250px' }}>
                      {ch.feedback || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {ch.pages > 0 && <button className="btn btn-ghost btn-sm">📄</button>}
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowUpload(true)}>
                          {ch.status === 'Not Submitted' ? '📤 Upload' : '↩ Re-upload'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Submission */}
        <div className="card" style={{ border: '2px dashed var(--border)' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '36px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</div>
            <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Ready for Final Submission?</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Complete all chapters and get supervisor approval before submitting the final thesis.
              Expected submission date: <strong>Sep 30, 2024</strong>
            </div>
            <button className="btn btn-primary btn-lg" disabled style={{ background: 'linear-gradient(90deg,#10B981,#059669)', opacity: 0.5 }}>
              🚀 Submit Final Thesis (Complete all chapters first)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
