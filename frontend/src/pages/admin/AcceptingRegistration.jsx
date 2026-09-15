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
      const token = sessionStorage.getItem('rms_token')
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
    if (!window.confirm('Approve this scholar registration under Bharathidasan University regulations?')) return
    try {
      const token = sessionStorage.getItem('rms_token')
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
      const token = sessionStorage.getItem('rms_token')
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
    if (!printWindow) return alert('Please allow popups to download/print PDF')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>PhD Registration - ${fd.candidateName || fd.name || 'Scholar'}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @page { size: A4; margin: 12mm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10.5pt; color: #111; background: #fff;
            padding: 10px; line-height: 1.35;
          }
          .hdr { text-align: center; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
          .hdr h1 { font-size: 14pt; font-weight: bold; letter-spacing: 0.5px; }
          .hdr h2 { font-size: 11pt; font-weight: bold; margin-top: 2px; }
          .hdr p { font-size: 9.5pt; margin-top: 2px; }
          .doc-sub { font-size: 9pt; font-weight: bold; text-decoration: underline; margin-top: 6px; }
          .photo-box {
            position: absolute; top: 12mm; right: 12mm; width: 35mm; height: 42mm;
            border: 1px solid #333; text-align: center; display: flex;
            align-items: center; justify-content: center; font-size: 8pt; color: #555;
          }
          .photo-box img { width: 100%; height: 100%; object-fit: cover; }
          table.items { width: 100%; border-collapse: collapse; margin-top: 6px; }
          table.items td { padding: 4px 6px; vertical-align: top; font-size: 10pt; }
          table.items td.num { width: 32px; font-weight: bold; text-align: right; padding-right: 8px; }
          table.items td.lbl { width: 34%; font-weight: 600; color: #222; }
          table.items td.val { width: 62%; }
          table.grid { width: 100%; border-collapse: collapse; margin: 6px 0 10px; }
          table.grid th, table.grid td { border: 1px solid #444; padding: 4px 6px; font-size: 8.5pt; text-align: left; }
          table.grid th { background: #f0f0f0; font-weight: bold; }
          .sig-row { display: flex; justify-content: space-between; margin-top: 36px; padding-top: 10px; }
          .sig-cell { text-align: center; width: 23%; font-size: 8.5pt; }
          .sig-cell .line { border-top: 1px solid #111; margin-top: 36px; padding-top: 4px; font-weight: 600; }
          .approved-stamp {
            border: 2px solid #2E6930; color: #2E6930; border-radius: 4px;
            padding: 4px 14px; font-weight: bold; font-size: 11pt;
            letter-spacing: 2px; transform: rotate(-3deg); display: inline-block;
          }
        </style>
      </head>
      <body onload="window.print();">
        <div class="photo-box">
          ${fd.photo ? `<img src="${fd.photo}" alt="Photo" />` : `Affix Recent Passport Size Photograph`}
        </div>

        <div class="hdr">
          <h1>BHARATHIDASAN UNIVERSITY</h1>
          <h2>TIRUCHIRAPPALLI – 24.</h2>
          <p style="font-weight:bold; margin-top:4px;">APPLICATION FORM FOR ADMISSION AND PROVISIONAL REGISTRATION FOR THE DEGREE OF DOCTOR OF PHILOSOPHY (Ph.D)</p>
          <p style="font-size:8.5pt; color:#444;">Research Centre: St. Joseph's College (Autonomous), Tiruchirappalli - 620 002</p>
          <div class="doc-sub">INFORMATION TO BE PROVIDED BY THE CANDIDATE</div>
        </div>

        <table class="items">
          <tr><td class="num">1.</td><td class="lbl">Category under which registration is sought</td><td class="val"><strong>${fd.category || "-"}</strong></td></tr>
          <tr><td class="num">2.</td><td class="lbl">Discipline / Subject which registration is sought</td><td class="val">${fd.discipline || fd.subject || "-"}</td></tr>
          <tr><td class="num">3.</td><td class="lbl">Name of the Candidate (as entered in Degree Certificate)</td><td class="val"><strong>${fd.candidateName || fd.name || "-"}</strong></td></tr>
          <tr><td class="num">4.</td><td class="lbl">Date of Birth & Age</td><td class="val">${fd.dob || "-"} &nbsp; (${fd.age ? fd.age + " Yrs" : "-"})</td></tr>
          <tr><td class="num">5.</td><td class="lbl">Sex</td><td class="val">${fd.sex || fd.gender || "-"}</td></tr>
          <tr><td class="num">6.</td><td class="lbl">Nationality / Religion</td><td class="val">${fd.nationality || "Indian"} / ${fd.religion || "-"} ${fd.christianDenom ? `(${fd.christianDenom})` : ""}</td></tr>
          <tr><td class="num">7.</td><td class="lbl">Community</td><td class="val">${fd.community || "-"}</td></tr>
          <tr><td class="num">8.</td><td class="lbl">Physically or Visually Challenged</td><td class="val">${fd.physicallyChallenged || "No"} ${fd.physicallyChallengedDetails ? `(${fd.physicallyChallengedDetails})` : ""}</td></tr>
          <tr><td class="num">9.</td><td class="lbl">Father’s / Guardian’s Name & Address</td><td class="val">${fd.fatherGuardianDetails || "-"}</td></tr>
          <tr><td class="num">10.</td><td class="lbl">Address to which Communication to be sent (with Pincode)</td><td class="val">${fd.communicationAddress || `${fd.street || ""}, ${fd.city || ""}, ${fd.district || ""}, ${fd.state || ""} - ${fd.pincode || ""}`}</td></tr>
          <tr><td class="num">11.</td><td class="lbl">If Part Time Candidate (Working Address)</td><td class="val">${fd.workingAddress || (fd.category === "Part Time" ? fd.institutionName || "-" : "N/A")}</td></tr>
          <tr><td class="num">12.</td><td class="lbl">Phone Number</td><td class="val">${fd.phone || "-"}</td></tr>
          <tr><td class="num">13.</td><td class="lbl">FAX</td><td class="val">${fd.fax || "-"}</td></tr>
          <tr><td class="num">14.</td><td class="lbl">Mobile Number</td><td class="val">${fd.mobile || fd.mobile1 || "-"}</td></tr>
          <tr><td class="num">15.</td><td class="lbl">E-mail</td><td class="val">${fd.email || sub.scholarId?.email || "-"}</td></tr>
          <tr><td class="num">16.</td><td class="lbl">Aadhaar No / Voter ID</td><td class="val">${fd.idProofNumber || fd.aadhaar || "-"} (${fd.idProofType || "Aadhaar"})</td></tr>
          <tr><td class="num">17.</td><td class="lbl">Passport No. / Visa Period</td><td class="val">${fd.passportNo ? `${fd.passportNo} / ${fd.visaPeriod || "N/A"}` : "N/A"}</td></tr>
        </table>

        <div style="font-weight:bold; margin: 12px 0 4px 6px; font-size:10pt;">
          18. Educational Qualification:
        </div>
        <table class="grid">
          <thead>
            <tr>
              <th>Course / Degree</th>
              <th>School / Institution / College</th>
              <th>Board / University</th>
              <th>Subject Studied</th>
              <th>% Marks</th>
              <th>Month & Year</th>
              <th>Mode of Study</th>
            </tr>
          </thead>
          <tbody>
            ${(fd.schoolQuals || []).map(r => `
              <tr>
                <td><strong>${r.course}</strong></td>
                <td>${r.school || "-"}</td>
                <td>${r.board || "-"}</td>
                <td>${r.degreeSubject || "-"}</td>
                <td>${r.percentage || "-"}</td>
                <td>${r.yearOfPassing || "-"}</td>
                <td>${r.studyType || "-"}</td>
              </tr>
            `).join("")}
            ${(fd.higherQuals || []).map(r => `
              <tr>
                <td><strong>${r.degree}</strong></td>
                <td>${r.college || "-"}</td>
                <td>${r.university || "-"}</td>
                <td>${r.subjectsStudied || "-"}</td>
                <td>${r.percentage || "-"}</td>
                <td>${r.yearOfPassing || "-"}</td>
                <td>${r.studyType || "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="font-size: 8.5pt; font-weight: bold; margin-bottom: 4px;">Marks / Grades obtained in Post Graduate Programme:</div>
        <table class="grid" style="margin-bottom: 10px;">
          <thead>
            <tr>
              <th>Total Marks Obtained</th>
              <th>Total Maximum Marks</th>
              <th>Percentage of Marks</th>
              <th>Class Obtained</th>
              <th>CGPA</th>
              <th>Overall Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${fd.pgGrades?.totalMarksObtained || "-"}</td>
              <td>${fd.pgGrades?.totalMaxMarks || "-"}</td>
              <td>${fd.pgGrades?.percentageMarks || fd.percentage || "-"}</td>
              <td>${fd.pgGrades?.classObtained || "-"}</td>
              <td>${fd.pgGrades?.cgpa || "-"}</td>
              <td>${fd.pgGrades?.overallGrade || "-"}</td>
            </tr>
          </tbody>
        </table>

        <table class="items">
          <tr><td class="num">19.</td><td class="lbl">Ph.D. Registration Qualifying Examination</td><td class="val">${fd.qualExamType || "-"} &nbsp;|&nbsp; Reg No: ${fd.qualExamRegNo || "-"} &nbsp;|&nbsp; Month & Year: ${fd.qualExamMonthYear || "-"}</td></tr>
          <tr><td class="num">20.</td><td class="lbl">Particular of service for Part-Time Candidates</td><td class="val">Total Service: <strong>${fd.totalServiceYears || "0"} Years</strong></td></tr>
        </table>

        ${(fd.serviceRecords && fd.serviceRecords.length > 0 && fd.serviceRecords[0].designation) ? `
          <table class="grid" style="margin-left: 36px; width: 94%;">
            <thead><tr><th>Designation</th><th>From</th><th>To</th><th>Institution / Organization</th><th>Email</th></tr></thead>
            <tbody>
              ${fd.serviceRecords.map(s => `
                <tr><td>${s.designation}</td><td>${s.from}</td><td>${s.to}</td><td>${s.institution}</td><td>${s.email}</td></tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}

        <table class="items">
          <tr><td class="num">21.</td><td class="lbl">Whether the Candidate awarded any fellowship</td><td class="val"><strong>${fd.fellowshipAwarded || "No"}</strong></td></tr>
          ${fd.fellowshipAwarded === "Yes" ? `
            <tr><td class="num">22.</td><td class="lbl">Fellowship Details</td><td class="val">Sponsor: ${fd.fellowshipSponsor || "-"} | Amount: ${fd.fellowshipAmount || "-"} | Period: ${fd.fellowshipPeriod || "-"}</td></tr>
          ` : `<tr><td class="num">22.</td><td class="lbl">Name of Sponsor & Fellowship Details</td><td class="val">N/A</td></tr>`}
          <tr><td class="num">23.</td><td class="lbl">Place where admission is sought to Conduct research</td><td class="val">${fd.researchDepartment || "St. Joseph's College (Autonomous), Tiruchirappalli"}</td></tr>
          <tr><td class="num">24.</td><td class="lbl">Registration sought in interdisciplinary area</td><td class="val">${fd.isInterdisciplinary || "No"} ${fd.interdisciplinaryArea ? `(${fd.interdisciplinaryArea})` : ""}</td></tr>
          <tr><td class="num">25.</td><td class="lbl">Broad Topic of Research</td><td class="val"><strong>${fd.broadTopic || fd.researchTitle || "-"}</strong></td></tr>
          <tr><td class="num">26.</td><td class="lbl">Supervisor / Guide Details</td><td class="val">${fd.supervisorName || fd.guide || sub.scholarId?.assignedSupervisor || "-"} ${fd.supervisorAddress ? `, ${fd.supervisorAddress}` : ""} ${fd.supervisorSuperannuation ? `(Superannuation: ${fd.supervisorSuperannuation})` : ""}</td></tr>
          <tr><td class="num">27.</td><td class="lbl">Total Ph.D. Scholars working under Supervisor</td><td class="val">Full-Time: <strong>${fd.supervisorScholarsFullTime || "0"}</strong> &nbsp;|&nbsp; Part-Time: <strong>${fd.supervisorScholarsPartTime || "0"}</strong></td></tr>
          <tr><td class="num">28.</td><td class="lbl">Co-Supervisor / Co-Guide (Inter-disciplinary)</td><td class="val">${fd.coSupervisorInterdisciplinary?.name || fd.coSupervisor || "N/A"}</td></tr>
          <tr><td class="num">29.</td><td class="lbl">Co-Supervisor / Co-Guide (Part-Time)</td><td class="val">${fd.coSupervisorPartTime?.name || "N/A"}</td></tr>
          <tr><td class="num">30.</td><td class="lbl">Payment Details</td><td class="val">Receipt/DD No: <strong>${fd.paymentDetails?.receiptNo || "-"}</strong> | Date: ${fd.paymentDetails?.transactionDate || "-"} | Amount: <strong>₹${fd.paymentDetails?.amount || "-"}</strong> | Bank: ${fd.paymentDetails?.bankName || "-"} (${fd.paymentDetails?.branchName || "-"})</td></tr>
        </table>

        <div style="margin-top: 14px; font-size: 8.5pt; font-style: italic; border-top: 1px dashed #777; padding-top: 6px;">
          I declare that all the particulars furnished above are correct and I submit that I will abide by the rules and regulations of Bharathidasan University and the Research Centre.
        </div>

        <div class="sig-row">
          <div class="sig-cell">
            ${fd.signature ? `<img src="${fd.signature}" style="max-height: 38px; display:block; margin: 0 auto 4px;" />` : `<div style="height:38px;"></div>`}
            <div class="line">Signature of Applicant</div>
          </div>
          <div class="sig-cell">
            <div style="height:38px;"></div>
            <div class="line">Signature of Research Supervisor / Guide</div>
          </div>
          <div class="sig-cell">
            <div style="height:38px;"></div>
            <div class="line">Head of Department</div>
          </div>
          <div class="sig-cell">
            <div style="height:38px;"></div>
            <div class="line">Head of Institution / Principal</div>
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
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Review and approve official Ph.D registration forms (Items 1 to 30)
          </span>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading registrations...
          </div>
        ) : submissions.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>No Submitted Registrations</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending registrations from candidate login will appear here.</div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate Name</th>
                    <th>Discipline</th>
                    <th>Category</th>
                    <th>Email / Phone</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => (
                    <tr key={sub._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {sub.formData?.candidateName || sub.formData?.name || sub.scholarId?.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {sub.formData?.community ? `(${sub.formData.community})` : ''}
                        </div>
                      </td>
                      <td>{sub.formData?.discipline || sub.formData?.subject || sub.scholarId?.dept || '-'}</td>
                      <td>
                        <span className="badge" style={{ background: '#F5EBE6', color: '#6B1F2A' }}>
                          {sub.formData?.category || 'Full Time'}
                        </span>
                      </td>
                      <td>
                        <div>{sub.formData?.email || sub.scholarId?.email || '-'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.formData?.mobile || sub.formData?.phone || '-'}</div>
                      </td>
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
                          Review Application
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
            background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '880px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid #E5E7EB',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Bharathidasan University Ph.D Application Review
                </span>
                <span className={`badge ${selectedSub.status === 'Approved' ? 'badge-success' : selectedSub.status === 'Pending' ? 'badge-info' : 'badge-danger'}`} style={{ marginLeft: '12px' }}>
                  {selectedSub.status}
                </span>
              </div>
              <button onClick={() => setSelectedSub(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B7280' }}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1, fontSize: '13px' }}>
              {/* Header Box */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #6B1F2A', paddingBottom: '10px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#6B1F2A', margin: 0 }}>BHARATHIDASAN UNIVERSITY, TIRUCHIRAPPALLI – 24</h2>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#444' }}>APPLICATION FORM FOR ADMISSION AND PROVISIONAL REGISTRATION FOR Ph.D DEGREE</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Research Centre: St. Joseph's College (Autonomous), Tiruchirappalli</div>
              </div>

              {/* Items 1 to 30 Display */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: '16px' }}>
                <div><strong>1. Category:</strong> {selectedSub.formData?.category || '-'}</div>
                <div><strong>2. Discipline:</strong> {selectedSub.formData?.discipline || selectedSub.formData?.subject || '-'}</div>
                <div><strong>3. Candidate Name:</strong> {selectedSub.formData?.candidateName || selectedSub.formData?.name || '-'}</div>
                <div><strong>4. Date of Birth & Age:</strong> {selectedSub.formData?.dob || '-'} ({selectedSub.formData?.age || '-'} Yrs)</div>
                <div><strong>5. Sex:</strong> {selectedSub.formData?.sex || selectedSub.formData?.gender || '-'}</div>
                <div><strong>6. Nationality / Religion:</strong> {selectedSub.formData?.nationality || 'Indian'} / {selectedSub.formData?.religion || '-'}</div>
                <div><strong>7. Community:</strong> {selectedSub.formData?.community || '-'}</div>
                <div><strong>8. Physically Challenged:</strong> {selectedSub.formData?.physicallyChallenged || 'No'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>9. Father’s / Guardian’s Name & Address:</strong> {selectedSub.formData?.fatherGuardianDetails || '-'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>10. Address for Communication:</strong> {selectedSub.formData?.communicationAddress || selectedSub.formData?.address || '-'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>11. Working Address (Part-Time):</strong> {selectedSub.formData?.workingAddress || 'N/A'}</div>
                <div><strong>12. Phone (Landline):</strong> {selectedSub.formData?.phone || '-'}</div>
                <div><strong>13. FAX:</strong> {selectedSub.formData?.fax || '-'}</div>
                <div><strong>14. Mobile:</strong> {selectedSub.formData?.mobile || selectedSub.formData?.mobile1 || '-'}</div>
                <div><strong>15. Email:</strong> {selectedSub.formData?.email || selectedSub.scholarId?.email || '-'}</div>
                <div><strong>16. Aadhaar / Voter ID:</strong> {selectedSub.formData?.idProofNumber || '-'} ({selectedSub.formData?.idProofType || 'Aadhaar'})</div>
                <div><strong>17. Passport / Visa:</strong> {selectedSub.formData?.passportNo || 'N/A'}</div>
              </div>

              {/* Item 18 Summary */}
              <div style={{ background: '#FAF6EC', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', border: '1px solid #E4DAC2' }}>
                <div style={{ fontWeight: 700, color: '#6B1F2A', marginBottom: '6px' }}>18. Educational Qualification & PG Grades:</div>
                <div style={{ fontSize: '12px', color: '#333' }}>
                  School &amp; Higher Education details submitted. PG Percentage: <strong>{selectedSub.formData?.pgGrades?.percentageMarks || '-'}</strong> | CGPA: <strong>{selectedSub.formData?.pgGrades?.cgpa || '-'}</strong> | Class: <strong>{selectedSub.formData?.pgGrades?.classObtained || '-'}</strong>
                </div>
              </div>

              {/* Items 19 to 30 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: '16px' }}>
                <div><strong>19. Ph.D Qualifying Exam:</strong> {selectedSub.formData?.qualExamType || '-'} (Reg: {selectedSub.formData?.qualExamRegNo || '-'})</div>
                <div><strong>20. Service (Part-Time):</strong> {selectedSub.formData?.totalServiceYears ? `${selectedSub.formData.totalServiceYears} Years` : 'N/A'}</div>
                <div><strong>21. Fellowship Awarded:</strong> {selectedSub.formData?.fellowshipAwarded || 'No'}</div>
                <div><strong>22. Fellowship Details:</strong> {selectedSub.formData?.fellowshipAwarded === 'Yes' ? `${selectedSub.formData?.fellowshipSponsor} (${selectedSub.formData?.fellowshipAmount})` : 'N/A'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>23. Research Place:</strong> {selectedSub.formData?.researchDepartment || '-'}</div>
                <div><strong>24. Interdisciplinary:</strong> {selectedSub.formData?.isInterdisciplinary || 'No'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>25. Broad Topic:</strong> <em>{selectedSub.formData?.broadTopic || selectedSub.formData?.researchTitle || '-'}</em></div>
                <div><strong>26. Supervisor Name:</strong> {selectedSub.formData?.supervisorName || selectedSub.scholarId?.assignedSupervisor || '-'}</div>
                <div><strong>27. Scholars under Guide:</strong> FT: {selectedSub.formData?.supervisorScholarsFullTime || '0'} | PT: {selectedSub.formData?.supervisorScholarsPartTime || '0'}</div>
                <div><strong>28. Co-Supervisor (Inter-disc.):</strong> {selectedSub.formData?.coSupervisorInterdisciplinary?.name || 'N/A'}</div>
                <div><strong>29. Co-Supervisor (Part-Time):</strong> {selectedSub.formData?.coSupervisorPartTime?.name || 'N/A'}</div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>30. Payment Details:</strong> Receipt/DD: <strong>{selectedSub.formData?.paymentDetails?.receiptNo || '-'}</strong> | Amount: <strong>₹{selectedSub.formData?.paymentDetails?.amount || '-'}</strong> | Bank: {selectedSub.formData?.paymentDetails?.bankName || '-'}
                </div>
              </div>

              {/* Signatures & Declaration status */}
              <div style={{ borderTop: '1px dashed #C9BFA3', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#4C6B58' }}>✓ Declaration accepted by candidate</span>
                </div>
                <div>
                  {selectedSub.formData?.signature ? (
                    <div style={{ textAlign: 'center' }}>
                      <img src={selectedSub.formData.signature} alt="Signature" style={{ maxHeight: '36px', border: '1px solid #ccc', padding: '2px' }} />
                      <div style={{ fontSize: '10px', color: '#666' }}>Applicant Signature</div>
                    </div>
                  ) : (
                    <span style={{ color: '#999' }}>No signature attached</span>
                  )}
                </div>
              </div>

              {showRejectInput && (
                <div style={{ marginTop: '16px', background: '#F9E6E8', border: '1px solid #F0B9BD', padding: '14px', borderRadius: '8px' }}>
                  <label className="form-label" style={{ color: '#9F1E24', fontWeight: 600 }}>Specify Rejection Reason</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Incomplete service certificate, marks discrepancy..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    rows={3}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(selectedSub._id)}>Reject Application</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowRejectInput(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 24px', borderTop: '1px solid #E5E7EB',
              display: 'flex', justifyContent: 'flex-end', gap: '10px'
            }}>
              <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Close</button>
              
              <button className="btn btn-primary" style={{ background: '#A9823E' }} onClick={handlePrint}>
                🖨️ Print Application Form
              </button>

              {selectedSub.status === 'Pending' && !showRejectInput && (
                <>
                  <button className="btn btn-danger" onClick={() => setShowRejectInput(true)}>
                    Reject
                  </button>
                  <button className="btn btn-primary" style={{ background: '#1E7D45' }} onClick={() => handleApprove(selectedSub._id)}>
                    Approve &amp; Accept
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
