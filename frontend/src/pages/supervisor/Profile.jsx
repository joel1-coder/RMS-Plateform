import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SupervisorProfile() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Supervisor & Associate Professor',
    email: 'sarah.jenkins@rms.edu',
    phone: '+91 98765 88990',
    dept: 'Computer Science & AI',
    office: 'Block 2, Room 402',
    designation: 'Associate Professor',
    experience: '12 years teaching & research',
    specialization: 'Artificial Intelligence, Machine Learning, Quantum Computing',
    address: 'Faculty Quarters, Campus Area, Tech City - 560001',
    dob: '1982-04-12',
    gender: 'Female',
    nationality: 'Indian',
  })
  const [form, setForm] = useState(profile)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSave = () => {
    setProfile(form)
    setEditing(false)
    toast.success('Supervisor profile updated successfully!')
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

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Supervisor Profile</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>View and edit your faculty academic profile</span>
        </div>
        <div className="topbar-actions">
          {editing ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setForm(profile) }}>✕ Cancel</button>
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={handleSave}>💾 Save Changes</button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          )}
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Faculty Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #6C63FF, #EC4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '34px', fontWeight: 800, color: '#fff',
                boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
              }}>
                {profile.name.charAt(4)}
              </div>
              <div style={{ fontWeight: 800, fontSize: '17px', marginBottom: '4px' }}>{profile.name}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{profile.title}</div>
              <span className="badge badge-success" style={{ fontSize: '12px' }}>Faculty Advisor</span>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>📷 Update Photo</button>
              </div>
            </div>

            {/* Specialization Card */}
            <div className="card card-body">
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' }}>Research Focus Areas</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profile.specialization.split(',').map((kw, i) => (
                  <span key={i} style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: '#EDE9FE', color: '#6C63FF', fontSize: '11px', fontWeight: 600 }}>
                    {kw.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div className="card-header"><div className="card-title">👤 Faculty Personal Information</div></div>
              <div className="card-body">
                <div className="grid-2">
                  <Field label="Full Name" name="name" />
                  <Field label="Date of Birth" name="dob" type="date" />
                  <Field label="Gender" name="gender" />
                  <Field label="Nationality" name="nationality" />
                  <Field label="Email Address" name="email" type="email" />
                  <Field label="Phone Number" name="phone" />
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Office Address</label>
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
              <div className="card-header"><div className="card-title">🎓 Academic & Departmental Info</div></div>
              <div className="card-body">
                <div className="grid-2">
                  <Field label="Department" name="dept" readOnly />
                  <Field label="Designation" name="designation" />
                  <Field label="Office Location" name="office" />
                  <Field label="Academic Experience" name="experience" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
