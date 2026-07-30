import { useState } from 'react'
import toast from 'react-hot-toast'

const INITIAL_MEMBER = () => ({
  id: Date.now() + Math.random(),
  name: '',
  idDesignation: '',
  gender: 'Male',
  category: 'Assistant Professor',
  department: '',
  collegeInstitution: '',
  pincode: '',
  city: '',
  email: '',
  mobile: '',
  recognitionLetter: null,
})

const SCHOLARS_LIST = [
  { regNo: 'BDU2020410504', name: 'Miss / Mrs. BHUVANESHWARI A', discipline: 'COMPUTER SCIENCE', status: 'APPROVED' },
  { regNo: 'BDU2020410331', name: 'Miss / Mrs. VIMAL VANI K', discipline: 'COMPUTER SCIENCE', status: 'APPROVED' },
  { regNo: 'BDU2021050612', name: 'Mr. ANTONY JOHN PRABU J', discipline: 'COMPUTER SCIENCE', status: 'PENDING APPROVAL' },
  { regNo: 'BDU2019882734', name: 'Miss / Mrs. DHANEDDHAMMA K', discipline: 'ELECTRONICS & COMM.', status: 'APPROVED' },
]

const genderOptions = ['Male', 'Female', 'Other']
const categoryOptions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Reader', 'Research Scientist']

export default function DCMembersManagement() {
  const [selectedScholarReg, setSelectedScholarReg] = useState('BDU2020410504')
  
  const activeScholar = SCHOLARS_LIST.find(s => s.regNo === selectedScholarReg) || SCHOLARS_LIST[0]

  const [dcMembers, setDcMembers] = useState([
    {
      id: 1,
      name: 'DEIVANAYAGAM J G R',
      idDesignation: '8415',
      gender: 'Male',
      category: 'Associate Professor',
      department: 'DEPARTMENT OF COMPUTER SCIENCE',
      collegeInstitution: 'BISHOP HEBER COLLEGE (AUTONOMOUS)',
      pincode: '620017',
      city: 'Tiruchirappalli',
      email: 'deiva.cs@heber.ac.in',
      mobile: '9894033176',
      recognitionLetter: null,
    },
    {
      id: 2,
      name: 'HARI GANESH S',
      idDesignation: '9476',
      gender: 'Male',
      category: 'Assistant Professor',
      department: 'DEPARTMENT OF COMPUTER SCIENCE',
      collegeInstitution: 'H.H. THE RAJA\'S COLLEGE (AUTONOMOUS)',
      pincode: '622001',
      city: 'Pudukkottai',
      email: 'hariganesh@rajas.edu.in',
      mobile: '9994058416',
      recognitionLetter: null,
    }
  ])

  const [submitting, setSubmitting] = useState(false)

  const handleMemberChange = (id, field, value) => {
    setDcMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleAddMember = () => {
    if (dcMembers.length >= 6) {
      toast.error('Maximum 6 DC Members allowed per committee')
      return
    }
    const newMember = {
      ...INITIAL_MEMBER(),
      name: '',
      department: activeScholar.discipline ? `DEPARTMENT OF ${activeScholar.discipline}` : '',
    }
    setDcMembers(prev => [...prev, newMember])
    toast.success(`DC Member ${dcMembers.length + 1} card added`)
  }

  const handleRemoveMember = (id) => {
    if (dcMembers.length <= 2) {
      toast.error('At least 2 DC Members are required for a Doctoral Committee')
      return
    }
    setDcMembers(prev => prev.filter(m => m.id !== id))
    toast.success('DC Member removed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Simple validation
    for (let i = 0; i < dcMembers.length; i++) {
      const m = dcMembers[i]
      if (!m.name.trim() || !m.department.trim() || !m.collegeInstitution.trim()) {
        toast.error(`Please fill in required details for DC Member ${i + 1}`)
        return
      }
    }

    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success(`DC Constitution with ${dcMembers.length} members submitted for ${activeScholar.name}!`)
    setSubmitting(false)
  }

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">DC Members Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Add, customize and manage Doctoral Committee members for PhD scholars
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Scholar Selector Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #7C3AED 0%, #4F46E5 100%)',
          borderRadius: 'var(--radius-md)', padding: '16px 22px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Select PhD Scholar for Committee Constitution
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={selectedScholarReg}
                onChange={e => setSelectedScholarReg(e.target.value)}
                style={{
                  padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: 'none',
                  fontSize: '14px', fontWeight: 700, color: '#1E1B4B', background: '#fff',
                  cursor: 'pointer', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                {SCHOLARS_LIST.map(s => (
                  <option key={s.regNo} value={s.regNo}>{s.name} [{s.regNo}]</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: activeScholar.status === 'APPROVED' ? '#10B981' : '#F59E0B', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '5px 14px', borderRadius: '99px' }}>
              STATUS: {activeScholar.status}
            </span>
          </div>
        </div>

        {/* Info Alert */}
        <div style={{
          background: '#FFF7ED', border: '1px solid #FED7AA',
          borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: '#F59E0B', fontSize: '18px', flexShrink: 0 }}>⚠️</span>
            <div style={{ fontSize: '12.5px', color: '#92400E', lineHeight: 1.6 }}>
              <strong>Committee Constitution Instructions:</strong><br />
              • A minimum of 2 external/internal DC Members are required to constitute the Doctoral Committee.<br />
              • You can dynamically add up to 6 members using the <strong>"➕ Add DC Member"</strong> button.<br />
              • File attachments are mandatory for members nominated outside Bharathidasan University.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Header Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              Doctoral Committee Members ({dcMembers.length} Members Added)
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(90deg, #10B981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 3px 10px rgba(16,185,129,0.3)',
              }}
            >
              ➕ Add DC Member Card
            </button>
          </div>

          {/* Members Dynamic Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: dcMembers.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {dcMembers.map((member, idx) => (
              <div key={member.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Member Header */}
                <div style={{
                  background: 'linear-gradient(90deg, #4F46E5, #6C63FF)',
                  color: '#fff', padding: '12px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <span style={{ fontWeight: 700, fontSize: '13.5px' }}>
                    👤 DC Member {idx + 1} {idx === 0 ? '(Research Adviser / External 1)' : idx === 1 ? '(Member 2)' : ''}
                  </span>
                  {dcMembers.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      title="Remove Member"
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>

                <div className="card-body" style={{ padding: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        NAME *
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        placeholder="Dr. / Mr. / Mrs. Full Name"
                        onChange={e => handleMemberChange(member.id, 'name', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        ID (DESIGNATION)
                      </label>
                      <input
                        type="text"
                        value={member.idDesignation}
                        placeholder="Designation Code / ID"
                        onChange={e => handleMemberChange(member.id, 'idDesignation', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        GENDER
                      </label>
                      <select
                        value={member.gender}
                        onChange={e => handleMemberChange(member.id, 'gender', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}
                      >
                        {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        CATEGORY
                      </label>
                      <select
                        value={member.category}
                        onChange={e => handleMemberChange(member.id, 'category', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}
                      >
                        {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        DEPARTMENT *
                      </label>
                      <input
                        type="text"
                        value={member.department}
                        placeholder="Department Name"
                        onChange={e => handleMemberChange(member.id, 'department', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        COLLEGE / INSTITUTION *
                      </label>
                      <input
                        type="text"
                        value={member.collegeInstitution}
                        placeholder="Institution Name & City"
                        onChange={e => handleMemberChange(member.id, 'collegeInstitution', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        CITY
                      </label>
                      <input
                        type="text"
                        value={member.city}
                        placeholder="City"
                        onChange={e => handleMemberChange(member.id, 'city', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        PIN CODE
                      </label>
                      <input
                        type="text"
                        value={member.pincode}
                        placeholder="Pincode"
                        onChange={e => handleMemberChange(member.id, 'pincode', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        EMAIL
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        placeholder="email@example.com"
                        onChange={e => handleMemberChange(member.id, 'email', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        MOBILE
                      </label>
                      <input
                        type="text"
                        value={member.mobile}
                        placeholder="Mobile Phone No"
                        onChange={e => handleMemberChange(member.id, 'mobile', e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        RECOGNITION LETTER
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '7px 14px', background: '#F1F5F9', border: '1.5px solid var(--border)',
                          borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)',
                        }}>
                          📎 Select File
                          <input type="file" style={{ display: 'none' }} onChange={e => handleMemberChange(member.id, 'recognitionLetter', e.target.files[0])} />
                        </label>
                        {member.recognitionLetter && <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>✓ {member.recognitionLetter.name}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => toast.success('Form reset')}
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 36px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(90deg, #7C3AED, #4F46E5)',
                color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s',
                boxShadow: '0 4px 14px rgba(108,99,255,0.4)',
              }}
            >
              {submitting ? '⏳ Submitting...' : '✅ Submit DC Constitution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
