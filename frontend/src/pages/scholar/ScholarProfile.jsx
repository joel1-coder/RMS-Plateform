import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ScholarProfile() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    regNo: 'PhD/2021/CS/042',
    email: 'rahul@rms.edu',
    phone: '+91 98765 43210',
    dept: 'Computer Science',
    batch: '2021',
    category: 'Full Time',
    area: 'Artificial Intelligence & Machine Learning',
    address: '12, Green Avenue, Tech City - 560001',
    dob: '1995-06-15',
    gender: 'Male',
    nationality: 'Indian',
    aadhaar: 'XXXX-XXXX-4567',
    qualification: 'M.Tech (CSE) - NIT Trichy, 2019',
    experience: '2 years industry experience at TCS',
  })
  const [form, setForm] = useState(profile)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSave = () => {
    setProfile(form)
    setEditing(false)
    toast.success('Profile updated successfully!')
  }

  const supervisorDetails = {
    name: 'Dr. Priya Kumar',
    designation: 'Associate Professor',
    dept: 'Computer Science',
    email: 'priya@rms.edu',
    phone: '+91 98765 11111',
    specialization: 'AI, Machine Learning, NLP',
    scholars: 8,
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
      <div className="topbar">
        <div>
          <div className="topbar-title">My Profile</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage your personal and academic details</span>
        </div>
        <div className="topbar-actions">
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
                {profile.name.charAt(0)}
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
                  <Field label="Email Address" name="email" type="email" />
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
