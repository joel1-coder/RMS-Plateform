import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import toast from 'react-hot-toast'

export default function AcceptingRegistration() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSub, setSelectedSub] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)


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
    const sub = selectedSub
    const fd = sub?.formData || {}
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>PhD Registration - ${fd.name || 'Scholar'}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @page { size: A4; margin: 0; }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            color: #111;
            background: #fff;
            padding: 28px 36px;
            line-height: 1.55;
          }
          /* -- Header -- */
          .hdr { text-align: center; border-bottom: 3px double #6B1420; padding-bottom: 14px; margin-bottom: 18px; }
          .hdr-logo {
            display: inline-block; width: 58px; height: 58px; border-radius: 50%;
            background: #6B1420; color: #fff; font-size: 28px; font-weight: 900;
            line-height: 58px; margin-bottom: 8px;
          }
          .hdr h1 { font-size: 16pt; font-weight: bold; letter-spacing: 0.5px; color: #6B1420; }
          .hdr p  { font-size: 10pt; color: #555; margin-top: 2px; }
          .doc-title {
            font-size: 13pt; font-weight: bold; text-align: center;
            letter-spacing: 1px; text-transform: uppercase;
            background: #6B1420; color: #fff;
            padding: 6px 20px; margin: 0 auto 18px;
            border-radius: 4px; display: inline-block; width: 100%;
          }
          /* -- Sections -- */
          .section { margin-bottom: 14px; }
          .section-title {
            font-size: 10pt; font-weight: bold; text-transform: uppercase;
            letter-spacing: 0.8px; color: #6B1420;
            border-bottom: 1.5px solid #B8862E;
            padding-bottom: 3px; margin-bottom: 8px;
          }
          table.info { width: 100%; border-collapse: collapse; }
          table.info td {
            padding: 4px 8px; font-size: 11pt; vertical-align: top;
          }
          table.info td.label { font-weight: bold; color: #555; width: 38%; }
          table.info td.value { color: #111; }
          /* -- Footer -- */
          .footer {
            margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end;
          }
          .sig-block { text-align: center; }
          .sig-line { border-top: 1px solid #333; margin-top: 36px; padding-top: 4px; font-size: 10pt; }
          .stamp { font-size: 10pt; color: #555; }
          .approved-stamp {
            border: 2px solid #3F6B4A; color: #3F6B4A; border-radius: 4px;
            padding: 4px 12px; font-weight: bold; font-size: 12pt;
            letter-spacing: 2px; transform: rotate(-4deg); display: inline-block;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">

        <!-- Header -->
        <div class="hdr">
          <div class="hdr-logo">R</div>
          <h1>University of Excellence</h1>
          <p>Office of the Director (Research) &nbsp;-&nbsp; PhD Registration & Admission Cell</p>
        </div>

        <div class="doc-title">PhD Scholar Registration Form - Official Copy</div>

        <!-- Personal Details -->
        <div class="section">
          <div class="section-title">I. Personal Details</div>
          <table class="info">
            <tr><td class="label">Full Name</td><td class="value">${fd.name || '-'}</td>
                <td class="label">Date of Birth</td><td class="value">${fd.dob || '-'}</td></tr>
            <tr><td class="label">Gender</td><td class="value">${fd.gender || '-'}</td>
                <td class="label">Category</td><td class="value">${fd.category || '-'}</td></tr>
            <tr><td class="label">Nationality</td><td class="value">${fd.nationality || '-'}</td>
                <td class="label">Aadhaar No.</td><td class="value">${fd.aadhaar || '-'}</td></tr>
            <tr><td class="label">Email Address</td><td class="value">${fd.email || sub.scholarId?.email || '-'}</td>
                <td class="label">Mobile No.</td><td class="value">${fd.phone || '-'}</td></tr>
          </table>
        </div>

        <!-- Address -->
        <div class="section">
          <div class="section-title">II. Address</div>
          <table class="info">
            <tr><td class="label">Present Address</td><td class="value" colspan="3">${fd.address || '-'}${fd.city ? ', ' + fd.city : ''}${fd.state ? ', ' + fd.state : ''}${fd.pincode ? ' - ' + fd.pincode : ''}</td></tr>
            <tr><td class="label">Permanent Address</td><td class="value" colspan="3">${fd.sameAsPresent ? 'Same as Present Address' : (fd.permanentAddress || '-')}</td></tr>
          </table>
        </div>

        <!-- Academic Details -->
        <div class="section">
          <div class="section-title">III. Academic Details</div>
          <table class="info">
            <tr><td class="label">Registration No.</td><td class="value">${fd.regNo || '-'}</td>
                <td class="label">Department</td><td class="value">${fd.dept || '-'}</td></tr>
            <tr><td class="label">Batch Year</td><td class="value">${fd.batch || '-'}</td>
                <td class="label">Category</td><td class="value">${fd.category || '-'}</td></tr>
            <tr><td class="label">Qualification</td><td class="value">${fd.qualification || '-'}</td>
                <td class="label">Institution</td><td class="value">${fd.institution || '-'}</td></tr>
            <tr><td class="label">Percentage / CGPA</td><td class="value">${fd.percentage || '-'}</td>
                <td class="label">Prior Experience</td><td class="value">${fd.experience ? fd.experience.substring(0, 60) + (fd.experience.length > 60 ? '...' : '') : '-'}</td></tr>
          </table>
        </div>

        <!-- Research Details -->
        <div class="section">
          <div class="section-title">IV. Research Details</div>
          <table class="info">
            <tr><td class="label">Research Title</td><td class="value" colspan="3">${fd.researchTitle || '-'}</td></tr>
            <tr><td class="label">Research Area</td><td class="value">${fd.area || '-'}</td>
                <td class="label">Keywords</td><td class="value">${fd.keywords || '-'}</td></tr>
            <tr><td class="label">Objectives</td><td class="value" colspan="3" style="white-space:pre-wrap">${fd.objectives ? fd.objectives.substring(0, 200) + (fd.objectives.length > 200 ? '...' : '') : '-'}</td></tr>
          </table>
        </div>

        <!-- Supervisor Details -->
        <div class="section">
          <div class="section-title">V. Supervisor Details</div>
          <table class="info">
            <tr><td class="label">Assigned Supervisor</td><td class="value">${fd.supervisorName || sub.scholarId?.assignedSupervisor || '-'}</td>
                <td class="label">Co-Supervisor</td><td class="value">${fd.coSupervisor || '-'}</td></tr>
          </table>
        </div>

        <!-- Footer / Signatures -->
        <div class="footer">
          <div class="sig-block">
            <div class="approved-stamp"> APPROVED</div>
            <div class="stamp" style="margin-top:6px">Approved on: ${sub.approvedAt ? new Date(sub.approvedAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '-'}</div>
          </div>
          <div class="sig-block">
            <div class="sig-line">Signature of Scholar</div>
          </div>
          <div class="sig-block">
            <div class="sig-line">Director of Research</div>
          </div>
        </div>

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
            <div style={{ fontSize: '40px', marginBottom: '12px' }}></div>
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
                      <td>{sub.scholarId?.dept || '-'}</td>
                      <td>{sub.scholarId?.email || '-'}</td>
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
                           View Details & Review
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
              <button onClick={() => setSelectedSub(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B7280' }}></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Print Template Wrapper (invisible/style-scoped) */}
              <div ref={printAreaRef}>
                <div className="header">
                  <h1>University of Excellence</h1>
                  <p>Office of the Director (Research) - PhD Registration Details</p>
                </div>

                <div className="section-title"> Personal Details</div>
                <div className="grid">
                  <div className="item"><span className="label">Full Name:</span><span className="value">{selectedSub.formData?.name || '-'}</span></div>
                  <div className="item"><span className="label">Date of Birth:</span><span className="value">{selectedSub.formData?.dob || '-'}</span></div>
                  <div className="item"><span className="label">Gender:</span><span className="value">{selectedSub.formData?.gender || '-'}</span></div>
                  <div className="item"><span className="label">Nationality:</span><span className="value">{selectedSub.formData?.nationality || '-'}</span></div>
                  <div className="item"><span className="label">Email Address:</span><span className="value">{selectedSub.formData?.email || selectedSub.scholarId?.email || '-'}</span></div>
                  <div className="item"><span className="label">Phone Number:</span><span className="value">{selectedSub.formData?.phone || '-'}</span></div>
                  <div className="item"><span className="label">Aadhaar Number:</span><span className="value">{selectedSub.formData?.aadhaar || '-'}</span></div>
                </div>

                <div className="item" style={{ marginTop: '10px' }}>
                  <span className="label" style={{ verticalAlign: 'top' }}>Residential Address:</span>
                  <span className="value" style={{ display: 'inline-block', maxWidth: '450px' }}>{selectedSub.formData?.address || '-'}</span>
                </div>

                <div className="section-title"> Academic & Research Details</div>
                <div className="grid">
                  <div className="item"><span className="label">Registration No:</span><span className="value">{selectedSub.formData?.regNo || '-'}</span></div>
                  <div className="item"><span className="label">Department:</span><span className="value">{selectedSub.formData?.dept || '-'}</span></div>
                  <div className="item"><span className="label">Batch Year:</span><span className="value">{selectedSub.formData?.batch || '-'}</span></div>
                  <div className="item"><span className="label">Category:</span><span className="value">{selectedSub.formData?.category || '-'}</span></div>
                  <div className="item"><span className="label">Research Area:</span><span className="value">{selectedSub.formData?.area || '-'}</span></div>
                  <div className="item"><span className="label">Qualification:</span><span className="value">{selectedSub.formData?.qualification || '-'}</span></div>
                </div>

                <div className="item" style={{ marginTop: '10px' }}>
                  <span className="label" style={{ verticalAlign: 'top' }}>Prior Experience:</span>
                  <span className="value" style={{ display: 'inline-block', maxWidth: '450px' }}>{selectedSub.formData?.experience || '-'}</span>
                </div>

                <div className="section-title"> Supervisor Details</div>
                <div className="grid">
                  <div className="item"><span className="label">Supervisor Name:</span><span className="value">{selectedSub.scholarId?.assignedSupervisor || '-'}</span></div>
                </div>

                <div className="footer">
                  <div className="signature">
                    Director of Research
                  </div>
                </div>
              </div>

              {/* End of Print Template */}

              {showRejectInput && (
                <div style={{ marginTop: '20px', background: '#F9E6E8', border: '1px solid #F0B9BD', padding: '16px', borderRadius: '10px' }}>
                  <label className="form-label" style={{ color: '#9F1E24', fontWeight: 600 }}>Specify Rejection Reason</label>
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
                <button className="btn btn-primary" style={{ background: '#1E7D45' }} onClick={handlePrint}>
                   Download Print Copy
                </button>
              )}

              {selectedSub.status === 'Pending' && !showRejectInput && (
                <>
                  <button className="btn btn-danger" onClick={() => setShowRejectInput(true)}>
                     Reject
                  </button>
                  <button className="btn btn-primary" style={{ background: '#1E7D45' }} onClick={() => handleApprove(selectedSub._id)}>
                     Approve & Accept
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
