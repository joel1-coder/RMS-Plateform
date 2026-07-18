import { useState } from 'react'
import toast from 'react-hot-toast'

const synopsisHistory = [
  { version: 'v1.0', date: '2022-02-10', status: 'Revision Required', remarks: 'Needs clearer problem statement and objectives.' },
  { version: 'v1.1', date: '2022-03-05', status: 'Pending DRC',       remarks: 'Forwarded to DRC for review.' },
  { version: 'v2.0', date: '2022-05-15', status: 'Approved',          remarks: 'Approved unanimously by DRC committee.' },
]

const TIMELINE_STEPS = ['Draft Prepared', 'Supervisor Review', 'Submitted', 'DRC Review', 'Approved']

export default function ScholarSynopsis() {
  const [showUpload, setShowUpload] = useState(false)
  const [file, setFile] = useState(null)
  const currentStep = 4 // 0-indexed — Approved

  return (
    <div className="animate-fade">
      {showUpload && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Submit Synopsis</span>
              <button className="modal-close" onClick={() => setShowUpload(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Synopsis Title</label>
                <input className="form-control" defaultValue="Artificial Intelligence in Healthcare Diagnostics" />
              </div>
              <div className="form-group">
                <label className="form-label">Version</label>
                <input className="form-control" placeholder="e.g. v2.1" />
              </div>
              <div className="form-group">
                <label className="form-label">Upload File (PDF only)</label>
                <div
                  style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => document.getElementById('syn-file').click()}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {file ? file.name : 'Click to upload or drag & drop'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, max 10MB</div>
                </div>
                <input id="syn-file" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label className="form-label">Remarks / Cover Note</label>
                <textarea className="form-control" rows={3} placeholder="Add any notes for your supervisor..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => { setShowUpload(false); toast.success('Synopsis submitted successfully!') }}>
                📤 Submit Synopsis
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Synopsis</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage your research synopsis submissions</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => setShowUpload(true)}>
            📤 Submit New Version
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Current Status Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #065F46, #047857)',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px', color: '#fff', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '24px',
        }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>✅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Synopsis Status</div>
            <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>Approved by DRC</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
              Your synopsis was approved on <strong>May 15, 2022</strong>. You may proceed with your research.
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-md)' }}>
              📄 Download Approved Copy
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header"><div className="card-title">Approval Timeline</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              {TIMELINE_STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < TIMELINE_STEPS.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i <= currentStep ? '#10B981' : 'var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '14px', fontWeight: 700,
                      border: i === currentStep ? '3px solid #059669' : 'none',
                      boxShadow: i === currentStep ? '0 0 0 4px rgba(16,185,129,0.2)' : 'none',
                    }}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <div style={{ fontSize: '11px', color: i <= currentStep ? '#059669' : 'var(--text-muted)', fontWeight: i === currentStep ? 700 : 400, marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {step}
                    </div>
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', background: i < currentStep ? '#10B981' : 'var(--border)', margin: '0 4px', marginBottom: '18px', transition: 'background 0.5s' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Synopsis Details */}
          <div className="card">
            <div className="card-header"><div className="card-title">Synopsis Details</div></div>
            <div className="card-body">
              {[
                { label: 'Title', value: 'Artificial Intelligence in Healthcare Diagnostics: A Deep Learning Approach' },
                { label: 'Scholar', value: 'Rahul Sharma (PhD/2021/CS/042)' },
                { label: 'Supervisor', value: 'Dr. Priya Kumar' },
                { label: 'Co-Supervisor', value: 'Dr. S. Iyer' },
                { label: 'Department', value: 'Computer Science' },
                { label: 'DRC Meeting Date', value: 'May 10, 2022' },
                { label: 'Approval Date', value: 'May 15, 2022' },
                { label: 'Current Version', value: 'v2.0 (Final)' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: '130px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{f.label}</span>
                  <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', flex: 1 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission History */}
          <div className="card">
            <div className="card-header"><div className="card-title">Submission History</div></div>
            <div className="card-body">
              {synopsisHistory.map((h, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '12px', background: h.status === 'Approved' ? '#F0FDF4' : '#FFFBEB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{h.version}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${h.status === 'Approved' ? 'badge-success' : h.status === 'Pending DRC' ? 'badge-info' : 'badge-warning'}`}>{h.status}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.date}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{h.remarks}</div>
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: '8px' }}>📄 Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
