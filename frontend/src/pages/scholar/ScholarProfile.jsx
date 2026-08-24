import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../utils/api'

export default function ScholarProfile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [profile, setProfile] = useState({
    name: '', regNo: '', email: '', phone: '', dept: '', batch: '', category: '', 
    area: '', address: '', dob: '', gender: '', nationality: '', aadhaar: '', 
    qualification: '', experience: '',
  })
  const [form, setForm] = useState(profile)
  const [submission, setSubmission] = useState(null)
  
  const [supervisorDetails, setSupervisorDetails] = useState({
    name: 'Not Assigned', designation: '—', dept: '—', email: '—', specialization: '—'
  })

  useEffect(() => {
    fetchProfile()
    if (user?.isTestAccount) {
      fetchSubmissionStatus()
    }
  }, [])

  const fetchSubmissionStatus = async () => {
    try {
      const res = await apiFetch('/api/test-accounts/my-registration', {
        headers: { Authorization: `Bearer ${localStorage.getItem('rms_token')}` }
      })
      if (res.ok) {
        const d = await res.json()
        setSubmission(d.data)
      }
    } catch {}
  }

  const fetchProfile = async () => {
    try {
      const res = await apiFetch('/api/users/me', { 
        headers: { Authorization: `Bearer ${localStorage.getItem('rms_token')}` } 
      })
      if (res.ok) {
        const data = await res.json()
        const p = data.profile || {}
        const newProfile = {
          name: data.name || '',
          email: data.email || '',
          dept: data.dept || '',
          regNo: p.regNo || '',
          phone: p.phone || '',
          batch: p.batch || '',
          category: p.category || '',
          area: p.area || '',
          address: p.address || '',
          dob: p.dob || '',
          gender: p.gender || '',
          nationality: p.nationality || '',
          aadhaar: p.aadhaar || '',
          qualification: p.qualification || '',
          experience: p.experience || '',
        }
        setProfile(newProfile)
        setForm(newProfile)

        if (data.assignedSupervisorId) {
          const sup = data.assignedSupervisorId
          setSupervisorDetails({
            name: sup.name,
            designation: 'Supervisor', 
            dept: sup.dept,
            email: sup.email,
            specialization: sup.profile?.specialization || 'Not specified',
          })
        }
      }
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  
  const handleSave = async () => {
    try {
      const res = await apiFetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('rms_token')}`
        },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Update failed')
      
      setProfile(form)
      setEditing(false)
      updateUser({ isProfileCompleted: true, name: form.name })
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleSubmitRegistration = async () => {
    try {
      const res = await apiFetch('/api/test-accounts/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('rms_token')}`
        },
        body: JSON.stringify({
          testAccountId: user.testAccountId,
          formData: form
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed')
      toast.success('Registration details submitted to Admin!')
      fetchSubmissionStatus()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const Field = ({ label, name, type = 'text', readOnly = false }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {editing && !readOnly ? (
        <input name={name} type={type} className="form-control" value={form[name]} onChange={handleChange} />
      ) : (
        <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', fontSize: '14px', color: 'var(--text-primary)', border: '1.5px solid var(--border)' }}>
          {profile[name] || '—'}
        </div>
      )}
    </div>
  )

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div className="spinner" style={{ borderColor:'rgba(16,185,129,0.3)', borderTopColor:'#10B981' }} />
    </div>
  )

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">My Profile</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage your personal and academic details</span>
        </div>
        <div className="topbar-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user?.isTestAccount && (
            <button 
              className="btn btn-primary btn-sm" 
              style={{ background: 'linear-gradient(90deg,#1e3a5f,#2563EB)' }} 
              onClick={handleSubmitRegistration}
              disabled={submission?.status === 'Pending' || submission?.status === 'Approved'}
            >
              🚀 {submission?.status === 'Pending' ? 'Submission Pending' : submission?.status === 'Approved' ? 'Approved' : 'Submit Registration to Admin'}
            </button>
          )}
          {editing ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setForm(profile) }}>✕ Cancel</button>
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={handleSave}>💾 Save Changes</button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          )}
        </div>
      </div>

      <div className="page-body">
        {user?.isTestAccount && (
          <div style={{
            background: submission?.status === 'Approved' ? '#DEF7EC' : submission?.status === 'Pending' ? '#EBF5FF' : submission?.status === 'Rejected' ? '#FDE8E8' : '#FEF3C7',
            border: `1px solid ${submission?.status === 'Approved' ? '#BCF0DA' : submission?.status === 'Pending' ? '#C3DDFD' : submission?.status === 'Rejected' ? '#F8B4B4' : '#FCD34D'}`,
            color: submission?.status === 'Approved' ? '#03543F' : submission?.status === 'Pending' ? '#1E429F' : submission?.status === 'Rejected' ? '#9B1C1C' : '#92400E',
            borderRadius: '12px', padding: '16px 20px', marginBottom: '20px',
            display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            width: '100%'
          }}>
            <span style={{ fontSize: '20px' }}>
              {submission?.status === 'Approved' ? '🎉' : submission?.status === 'Pending' ? '⏳' : submission?.status === 'Rejected' ? '❌' : '🧪'}
            </span>
            <div>
              <div style={{ fontWeight: 700 }}>
                {submission?.status === 'Approved' ? 'Registration Approved!' : submission?.status === 'Pending' ? 'Registration Pending Review' : submission?.status === 'Rejected' ? 'Registration Rejected' : 'Test Login Mode'}
              </div>
              <div style={{ fontSize: '13px', marginTop: '2px', opacity: 0.9 }}>
                {submission?.status === 'Approved' && 'Your registration details have been verified and approved by the Administrator.'}
                {submission?.status === 'Pending' && 'Your details are with the Administrator for approval. You can view the status here.'}
                {submission?.status === 'Rejected' && `Rejection Reason: ${submission.rejectionReason || 'No reason provided'}. Please correct your details and re-submit.`}
                {!submission && 'Please complete all fields in your profile and click "Submit Registration to Admin" to proceed.'}
              </div>
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Profile Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #10B981, #3B82F6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '34px', fontWeight: 800, color: '#fff',
                boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
              }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ fontWeight: 800, fontSize: '17px', marginBottom: '4px' }}>{profile.name}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{profile.regNo}</div>
              <span className="badge badge-success" style={{ fontSize: '12px' }}>Active Scholar</span>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>📷 Change Photo</button>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>📥 Download ID Card</button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="card card-body">
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' }}>Quick Info</div>
              {[
                { icon: '🏛️', label: 'Department', value: profile.dept },
                { icon: '📅', label: 'Batch', value: profile.batch },
                { icon: '🎓', label: 'Category', value: profile.category },
                { icon: '🔬', label: 'Research Area', value: profile.area },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Supervisor Card */}
            <div className="card card-body" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' }}>My Supervisor</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="avatar" style={{ background: 'linear-gradient(135deg,#6C63FF,#10B981)', width: 44, height: 44, fontSize: 16 }}>P</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{supervisorDetails.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{supervisorDetails.designation}</div>
                </div>
              </div>
              {[
                { label: 'Specialization', value: supervisorDetails.specialization },
                { label: 'Email', value: supervisorDetails.email },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div className="card-header"><div className="card-title">👤 Personal Information</div></div>
              <div className="card-body">
                <div className="grid-2">
                  <Field label="Full Name" name="name" />
                  <Field label="Date of Birth" name="dob" type="date" />
                  <Field label="Gender" name="gender" />
                  <Field label="Nationality" name="nationality" />
                  <Field label="Email Address" name="email" type="email" readOnly />
                  <Field label="Phone Number" name="phone" />
                  <Field label="Aadhaar No." name="aadhaar" />
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Address</label>
                    {editing ? (
                      <textarea name="address" className="form-control" rows={2} value={form.address} onChange={handleChange} />
                    ) : (
                      <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', fontSize: '14px', border: '1.5px solid var(--border)' }}>{profile.address}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">🎓 Academic Information</div></div>
              <div className="card-body">
                <div className="grid-2">
                  <Field label="Registration No." name="regNo" readOnly />
                  <Field label="Department" name="dept" readOnly />
                  <Field label="Batch Year" name="batch" readOnly />
                  <Field label="Scholar Category" name="category" />
                  <Field label="Research Area" name="area" />
                  <Field label="Qualification" name="qualification" />
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Prior Experience</label>
                    {editing ? (
                      <textarea name="experience" className="form-control" rows={2} value={form.experience} onChange={handleChange} />
                    ) : (
                      <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', fontSize: '14px', border: '1.5px solid var(--border)' }}>{profile.experience}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">🔒 Change Password</div></div>
              <div className="card-body">
                <div className="grid-2">
                  {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                    <div className="form-group" key={i} style={i === 2 ? { gridColumn: '1/-1', maxWidth: '50%' } : {}}>
                      <label className="form-label">{label}</label>
                      <input type="password" className="form-control" placeholder="••••••••" disabled={!editing} />
                    </div>
                  ))}
                </div>
                {editing && <button className="btn btn-outline btn-sm" style={{ borderColor: '#10B981', color: '#10B981' }}>🔒 Update Password</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
