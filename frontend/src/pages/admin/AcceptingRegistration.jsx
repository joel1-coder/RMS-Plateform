import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '../../utils/api'
import toast from 'react-hot-toast'

export default function AcceptingRegistration() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSub, setSelectedSub] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const printAreaRef = useRef(null)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('rms_token')
      const res = await apiFetch('/api/test-accounts/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setSubmissions(data.data || [])
    } catch {
      toast.error('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this scholar registration?')) return
    try {
      const token = localStorage.getItem('rms_token')
      const res = await apiFetch(`/api/test-accounts/registrations/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Approve failed')
      toast.success('Registration approved successfully!')
      setSelectedSub(null)
      fetchRegistrations()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a reason for rejection')
      return
    }
    try {
      const token = localStorage.getItem('rms_token')
      const res = await apiFetch(`/api/test-accounts/registrations/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      })
      if (!res.ok) throw new Error('Reject failed')
      toast.success('Registration rejected')
      setShowRejectInput(false)
      setRejectReason('')
      setSelectedSub(null)
      fetchRegistrations()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handlePrint = () => {
    const printContent = printAreaRef.current.innerHTML
    const originalContent = document.body.innerHTML
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Scholar Registration Details</title>
          <style>
            body { font-family: 'Georgia', 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0 0 5px; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
            .header p { margin: 0; font-size: 14px; color: #555; }
            .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin: 25px 0 15px; text-transform: uppercase; color: #222; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px 30px; margin-bottom: 20px; }
            .item { font-size: 13.5px; }
            .label { font-weight: bold; color: #555; display: inline-block; width: 160px; }
            .value { color: #111; }
            .footer { margin-top: 60px; text-align: right; font-size: 14px; font-weight: bold; }
            .signature { border-top: 1px dashed #777; display: inline-block; width: 200px; margin-top: 40px; text-align: center; padding-top: 5px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Accepting Registration</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Review and approve submitted scholar registration forms</span>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📥</div>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>No Submitted Registrations</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending registrations from test login users will appear here.</div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Scholar Name</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => (
                    <tr key={sub._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {sub.formData?.name || sub.scholarId?.name}
                        </span>
                      </td>
                      <td>{sub.scholarId?.dept || '—'}</td>
                      <td>{sub.scholarId?.email || '—'}</td>
                      <td>{new Date(sub.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <span className={`badge ${sub.status === 'Approved' ? 'badge-success' : sub.status === 'Pending' ? 'badge-info' : 'badge-danger'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setSelectedSub(sub); setShowRejectInput(false); setRejectReason(''); }}
                        >
                          👁️ View Details & Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      {selectedSub && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '800px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #E5E7EB',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Registration Form Review</span>
                <span className={`badge ${selectedSub.status === 'Approved' ? 'badge-success' : selectedSub.status === 'Pending' ? 'badge-info' : 'badge-danger'}`} style={{ marginLeft: '12px' }}>
                  {selectedSub.status}
                </span>
              </div>
              <button onClick={() => setSelectedSub(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B7280' }}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Print Template Wrapper (invisible/style-scoped) */}
              <div ref={printAreaRef}>
                <div className="header">
                  <h1>University of Excellence</h1>
                  <p>Office of the Director (Research) · PhD Registration Details</p>
                </div>

                <div className="section-title">👤 Personal Details</div>
                <div className="grid">
                  <div className="item"><span className="label">Full Name:</span><span className="value">{selectedSub.formData?.name || '—'}</span></div>
                  <div className="item"><span className="label">Date of Birth:</span><span className="value">{selectedSub.formData?.dob || '—'}</span></div>
                  <div className="item"><span className="label">Gender:</span><span className="value">{selectedSub.formData?.gender || '—'}</span></div>
                  <div className="item"><span className="label">Nationality:</span><span className="value">{selectedSub.formData?.nationality || '—'}</span></div>
                  <div className="item"><span className="label">Email Address:</span><span className="value">{selectedSub.formData?.email || selectedSub.scholarId?.email || '—'}</span></div>
                  <div className="item"><span className="label">Phone Number:</span><span className="value">{selectedSub.formData?.phone || '—'}</span></div>
                  <div className="item"><span className="label">Aadhaar Number:</span><span className="value">{selectedSub.formData?.aadhaar || '—'}</span></div>
                </div>

                <div className="item" style={{ marginTop: '10px' }}>
                  <span className="label" style={{ verticalAlign: 'top' }}>Residential Address:</span>
                  <span className="value" style={{ display: 'inline-block', maxWidth: '450px' }}>{selectedSub.formData?.address || '—'}</span>
                </div>

                <div className="section-title">🎓 Academic & Research Details</div>
                <div className="grid">
                  <div className="item"><span className="label">Registration No:</span><span className="value">{selectedSub.formData?.regNo || '—'}</span></div>
                  <div className="item"><span className="label">Department:</span><span className="value">{selectedSub.formData?.dept || '—'}</span></div>
                  <div className="item"><span className="label">Batch Year:</span><span className="value">{selectedSub.formData?.batch || '—'}</span></div>
                  <div className="item"><span className="label">Category:</span><span className="value">{selectedSub.formData?.category || '—'}</span></div>
                  <div className="item"><span className="label">Research Area:</span><span className="value">{selectedSub.formData?.area || '—'}</span></div>
                  <div className="item"><span className="label">Qualification:</span><span className="value">{selectedSub.formData?.qualification || '—'}</span></div>
                </div>

                <div className="item" style={{ marginTop: '10px' }}>
                  <span className="label" style={{ verticalAlign: 'top' }}>Prior Experience:</span>
                  <span className="value" style={{ display: 'inline-block', maxWidth: '450px' }}>{selectedSub.formData?.experience || '—'}</span>
                </div>

                <div className="section-title">👨‍🏫 Supervisor Details</div>
                <div className="grid">
                  <div className="item"><span className="label">Supervisor Name:</span><span className="value">{selectedSub.scholarId?.assignedSupervisor || '—'}</span></div>
                </div>

                <div className="footer">
                  <div className="signature">
                    Director of Research
                  </div>
                </div>
              </div>

              {/* End of Print Template */}

              {showRejectInput && (
                <div style={{ marginTop: '20px', background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '16px', borderRadius: '10px' }}>
                  <label className="form-label" style={{ color: '#991B1B', fontWeight: 600 }}>Specify Rejection Reason</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Incomplete address, incorrect academic info..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    rows={3}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(selectedSub._id)}>Reject Now</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowRejectInput(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid #E5E7EB',
              display: 'flex', justifyContent: 'flex-end', gap: '10px'
            }}>
              <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Close</button>
              
              {selectedSub.status === 'Approved' && (
                <button className="btn btn-primary" style={{ background: '#10B981' }} onClick={handlePrint}>
                  🖨️ Download Print Copy
                </button>
              )}

              {selectedSub.status === 'Pending' && !showRejectInput && (
                <>
                  <button className="btn btn-danger" onClick={() => setShowRejectInput(true)}>
                    ✕ Reject
                  </button>
                  <button className="btn btn-primary" style={{ background: '#10B981' }} onClick={() => handleApprove(selectedSub._id)}>
                    ✓ Approve & Accept
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
