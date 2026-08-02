import { useState, useEffect } from 'react'

export default function DRCViewScholars() {
  const [scholars, setScholars] = useState([])
  const [search, setSearch] = useState('')
  const [selectedScholar, setSelectedScholar] = useState(null)

  useEffect(() => {
    // Load users from localStorage (rms_all_users)
    const stored = localStorage.getItem('rms_all_users')
    if (stored) {
      try {
        const users = JSON.parse(stored)
        const scholarList = users.filter(u => u.role?.toLowerCase() === 'scholar')
        setScholars(scholarList)
      } catch (e) {
        console.error('Failed to parse users', e)
      }
    }
  }, [])

  // Helper to determine if a scholar joined recently (e.g., 2024 or 2026)
  const isRecentlyJoined = (joinedDate) => {
    if (!joinedDate) return false
    const year = parseInt(joinedDate.split('-')[0], 10)
    return year >= 2024
  }

  // Get matching profile details for modal from localStorage or fallback
  const getScholarFullProfile = (scholar) => {
    const custom = localStorage.getItem(`rms_scholar_profile_${scholar.id}`)
    if (custom) {
      try {
        return JSON.parse(custom)
      } catch { /* ignore */ }
    }
    // Default fallback mock profile matching ScholarProfileView structure
    return {
      subject: scholar.dept || 'Computer Science',
      name: scholar.name,
      fathersName: 'John Doe',
      permanentAddress: '123 Main St, City, State, ZIP',
      communicationAddress: '123 Main St, City, State, ZIP',
      sex: 'Male',
      bloodGroup: 'O+',
      dob: '01/01/1995',
      religion: 'Hindu',
      community: 'BC',
      caste: 'Example Caste',
      aadharNumber: '1234 5678 9012',
      mailId: scholar.email,
      occupation: 'Software Engineer',
      mothersName: 'Jane Doe',
      orphanStatus: 'No',
      annualIncome: '5,000,00',
      bankName: 'State Bank of India',
      accountNumber: '12345678901',
      ifscCode: 'SBIN0001234',
      courseYear: scholar.joined ? scholar.joined.split('-')[0] : '2024',
      universityRegistrationNo: `PHD${scholar.id}CS001`,
      registrationSessionYear: '2023-2024',
      broadTitle: 'Research Topic Pending Registration',
      nameOfGuide: scholar.assignedSupervisor || 'Dr. Priya Kumar',
      guideRefNumber: 'G-2020-123',
      workingStatus: 'Full Time',
    }
  }

  const filtered = scholars.filter(s => {
    const term = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(term) ||
      (s.assignedSupervisor || '').toLowerCase().includes(term) ||
      (s.dept || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">View Scholars</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Monitor enrolled PhD candidates, their supervisors, and registration status
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Search and Filters */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', padding: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by scholar name, supervisor, or department..."
              className="form-control"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Scholars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(s => {
            const recent = isRecentlyJoined(s.joined)
            return (
              <div 
                key={s.id} 
                className="card animate-fade"
                style={{
                  padding: '24px',
                  position: 'relative',
                  border: recent ? '2px solid #10B981' : '1px solid var(--border)',
                  boxShadow: recent ? '0 10px 25px -5px rgba(16,185,129,0.1)' : 'var(--shadow-sm)',
                  background: recent ? 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)' : '#fff',
                }}
              >
                {recent && (
                  <span style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: '#10B981', color: '#fff', fontSize: '10px', fontWeight: 800,
                    padding: '4px 10px', borderRadius: '99px', letterSpacing: '0.5px'
                  }}>
                    ✨ RECENTLY JOINED
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div className="avatar" style={{
                    background: recent ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #6C63FF, #4F46E5)',
                    color: '#fff', width: '45px', height: '45px', fontSize: '18px', fontWeight: 'bold'
                  }}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#1E293B' }}>{s.name}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Joined: {s.joined || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Department:</strong>
                    <span>{s.dept || 'Computer Science'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Email:</strong>
                    <span>{s.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Supervisor:</strong>
                    <span style={{
                      background: s.assignedSupervisor ? '#EFF6FF' : '#FEF2F2',
                      color: s.assignedSupervisor ? '#1D4ED8' : '#B91C1C',
                      padding: '3px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'
                    }}>
                      {s.assignedSupervisor || 'Not Assigned'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Status:</strong>
                    <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-gray'}`} style={{ padding: '2px 8px' }}>
                      {s.status || 'Active'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedScholar(s)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', padding: '10px', fontWeight: 700 }}
                >
                  📄 View Full Profile
                </button>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 0', color: 'var(--text-secondary)' }}>
              No scholars found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {selectedScholar && (() => {
        const p = getScholarFullProfile(selectedScholar)
        return (
          <div className="modal-backdrop">
            <div className="modal" style={{ maxWidth: '850px', width: '90%' }}>
              <div className="modal-header">
                <span className="modal-title">Scholar Academic Profile Details</span>
                <button className="modal-close" onClick={() => setSelectedScholar(null)}>✕</button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  
                  <div>
                    <h4 style={{ color: '#0F766E', borderBottom: '2px solid #E2E8F0', paddingBottom: '6px', marginBottom: '12px', fontWeight: 700 }}>
                      Basic Information
                    </h4>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr><td style={{ padding: '6px 0', color: '#64748B', width: '40%' }}><strong>Subject:</strong></td><td>{p.subject}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Scholar Name:</strong></td><td>{p.name}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Gender:</strong></td><td>{p.sex}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Blood Group:</strong></td><td>{p.bloodGroup}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Date of Birth:</strong></td><td>{p.dob}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Aadhar No:</strong></td><td>{p.aadharNumber}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Mail ID:</strong></td><td>{p.mailId}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 style={{ color: '#0F766E', borderBottom: '2px solid #E2E8F0', paddingBottom: '6px', marginBottom: '12px', fontWeight: 700 }}>
                      Ph.D. & Guide Info
                    </h4>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr><td style={{ padding: '6px 0', color: '#64748B', width: '40%' }}><strong>Guide (Supervisor):</strong></td><td style={{ fontWeight: 600, color: '#1E3A8A' }}>{p.nameOfGuide}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Registration No:</strong></td><td>{p.universityRegistrationNo}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Session / Year:</strong></td><td>{p.registrationSessionYear}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Working Status:</strong></td><td>{p.workingStatus}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Thesis Title:</strong></td><td>{p.broadTitle}</td></tr>
                        <tr><td style={{ padding: '6px 0', color: '#64748B' }}><strong>Admission Date:</strong></td><td>{p.dateOfAdmission}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <h4 style={{ color: '#0F766E', borderBottom: '2px solid #E2E8F0', paddingBottom: '6px', marginBottom: '12px', fontWeight: 700 }}>
                      Addresses & Contact Records
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '13px' }}>
                      <div>
                        <strong>Permanent Address:</strong>
                        <p style={{ margin: '4px 0', color: '#475569' }}>{p.permanentAddress}</p>
                      </div>
                      <div>
                        <strong>Communication Address:</strong>
                        <p style={{ margin: '4px 0', color: '#475569' }}>{p.communicationAddress}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedScholar(null)}>Close Profile</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
