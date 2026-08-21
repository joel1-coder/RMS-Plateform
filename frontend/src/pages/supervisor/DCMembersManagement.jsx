import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../utils/api'
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

const DEFAULT_DC_MEMBERS = {}

const genderOptions = ['Male', 'Female', 'Other']
const categoryOptions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Reader', 'Research Scientist']

export default function DCMembersManagement() {
  const { user } = useAuth()
  const [scholarsList, setScholarsList] = useState([])
  const [selectedScholarReg, setSelectedScholarReg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState({}) // { [memberId]: boolean }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadScholars() {
      try {
        setLoading(true)
        const token = localStorage.getItem('rms_token')
        const res = await apiFetch('/api/users?role=scholar', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const allScholars = await res.json()
          const myId = user?.id || user?._id
          const myName = (user?.name || '').toLowerCase().trim()
          const myScholars = allScholars.filter(s =>
            (s.assignedSupervisorId && (s.assignedSupervisorId === myId || s.assignedSupervisorId?._id === myId)) ||
            (s.assignedSupervisor && s.assignedSupervisor.toLowerCase().trim() === myName)
          ).map(s => ({
            id: s.id || s._id,
            regNo: s.profile?.regNo || s.email?.split('@')[0]?.toUpperCase() || 'SCHOLAR',
            name: s.name,
            discipline: s.dept || 'COMPUTER SCIENCE',
            status: s.status === 'Active' ? 'APPROVED' : 'PENDING'
          }))

          setScholarsList(myScholars)
          if (myScholars.length > 0) {
            setSelectedScholarReg(myScholars[0].regNo)
          }
        }
      } catch (err) {
        console.error('Failed to load scholars for DC management', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadScholars()
    }
  }, [user])

  const activeScholar = scholarsList.find(s => s.regNo === selectedScholarReg) || scholarsList[0] || {
    name: 'No Scholar Selected',
    regNo: '—',
    discipline: '—',
    status: 'PENDING'
  }

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

  // Initialize defaults on mount
  useEffect(() => {
    Object.keys(DEFAULT_DC_MEMBERS).forEach(reg => {
      if (!localStorage.getItem(`rms_dc_members_${reg}`)) {
        localStorage.setItem(`rms_dc_members_${reg}`, JSON.stringify(DEFAULT_DC_MEMBERS[reg]))
      }
    })
  }, [])

  // Sync DC members when selected scholar changes
  useEffect(() => {
    const stored = localStorage.getItem(`rms_dc_members_${selectedScholarReg}`)
    if (stored) {
      setDcMembers(JSON.parse(stored))
    } else {
      setDcMembers([INITIAL_MEMBER(), INITIAL_MEMBER()])
    }
  }, [selectedScholarReg])

  // Gather unique pool of all previously stored DC members
  const getExistingMembersPool = () => {
    const pool = []
    const keys = Object.keys(localStorage)
    const seenNames = new Set()
    
    // First load from local storage
    keys.forEach(key => {
      if (key.startsWith('rms_dc_members_')) {
        try {
          const members = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(members)) {
            members.forEach(m => {
              if (m.name && !seenNames.has(m.name.toLowerCase())) {
                seenNames.add(m.name.toLowerCase())
                pool.push(m)
              }
            })
          }
        } catch (e) {
          console.error(e)
        }
      }
    })

    // Fallback to default lists if not already added
    Object.values(DEFAULT_DC_MEMBERS).forEach(members => {
      members.forEach(m => {
        if (m.name && !seenNames.has(m.name.toLowerCase())) {
          seenNames.add(m.name.toLowerCase())
          pool.push(m)
        }
      })
    })

    return pool
  }

  const existingMembersPool = getExistingMembersPool()

  const handleMemberChange = (id, field, value) => {
    setDcMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleSelectExisting = (cardId, selectedMember) => {
    setDcMembers(prev => prev.map(m => m.id === cardId ? {
      ...m,
      name: selectedMember.name,
      idDesignation: selectedMember.idDesignation || '',
      gender: selectedMember.gender || 'Male',
      category: selectedMember.category || 'Assistant Professor',
      department: selectedMember.department || '',
      collegeInstitution: selectedMember.collegeInstitution || '',
      pincode: selectedMember.pincode || '',
      city: selectedMember.city || '',
      email: selectedMember.email || '',
      mobile: selectedMember.mobile || '',
    } : m))
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
    localStorage.setItem(`rms_dc_members_${selectedScholarReg}`, JSON.stringify(dcMembers))
    toast.success(`DC Constitution with ${dcMembers.length} members submitted and stored for ${activeScholar.name}!`)
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
                {scholarsList.length === 0 ? (
                  <option value="">-- No Scholars Assigned Yet --</option>
                ) : (
                  scholarsList.map(s => (
                    <option key={s.regNo} value={s.regNo}>{s.name} [{s.regNo}]</option>
                  ))
                )}
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
            {dcMembers.map((member, idx) => {
              const suggestions = existingMembersPool.filter(p => 
                p.name.toLowerCase().includes((member.name || '').toLowerCase())
              )
              const hasTyped = member.name.trim().length > 0

              return (
                <div key={member.id} className="card" style={{ position: 'relative', overflow: 'visible' }}>
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
                      
                      {/* Name input with custom autocomplete and dropdown quick select */}
                      <div style={{ gridColumn: '1 / -1', position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                          NAME *
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={member.name}
                            placeholder="Dr. / Mr. / Mrs. Full Name"
                            onChange={e => {
                              handleMemberChange(member.id, 'name', e.target.value)
                              setShowSuggestions(prev => ({ ...prev, [member.id]: true }))
                            }}
                            onFocus={() => setShowSuggestions(prev => ({ ...prev, [member.id]: true }))}
                            onBlur={() => {
                              // Small delay to let onMouseDown register on options
                              setTimeout(() => {
                                setShowSuggestions(prev => ({ ...prev, [member.id]: false }))
                              }, 250)
                            }}
                            style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                          />
                          
                          {/* Quick dropdown choice */}
                          <select
                            onChange={(e) => {
                              const matched = existingMembersPool.find(p => p.name === e.target.value)
                              if (matched) {
                                handleSelectExisting(member.id, matched)
                                toast.success(`Autofilled details for ${matched.name}`)
                              }
                            }}
                            value=""
                            className="form-control form-select"
                            style={{ width: '160px', padding: '8px 10px', fontSize: '12.5px', flexShrink: 0 }}
                          >
                            <option value="" disabled>Or Quick Select...</option>
                            {existingMembersPool.map(p => (
                              <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Suggestions Dropdown panel */}
                        {showSuggestions[member.id] && hasTyped && suggestions.length > 0 && (
                          <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            background: '#fff', border: '1.5px solid #6C63FF', borderRadius: '4px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, maxHeight: '200px', overflowY: 'auto',
                            marginTop: '4px'
                          }}>
                            {suggestions.map(s => (
                              <div
                                key={s.name}
                                onMouseDown={() => {
                                  handleSelectExisting(member.id, s)
                                  toast.success(`Autofilled details for ${s.name}`)
                                  setShowSuggestions(prev => ({ ...prev, [member.id]: false }))
                                }}
                                style={{
                                  padding: '8px 12px', cursor: 'pointer', fontSize: '12.5px', borderBottom: '1px solid #E2E8F0',
                                  display: 'flex', justifyContent: 'space-between', background: '#fff'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                              >
                                <div>
                                  <strong style={{ color: '#4F46E5' }}>{s.name}</strong>
                                  <div style={{ fontSize: '11px', color: '#64748B' }}>{s.category} · {s.collegeInstitution}</div>
                                </div>
                                <span style={{ fontSize: '10px', color: '#10B981', alignSelf: 'center', fontWeight: 'bold' }}>Select to Autofill</span>
                              </div>
                            ))}
                          </div>
                        )}
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
              )
            })}
          </div>

          {/* Submit Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setDcMembers([INITIAL_MEMBER(), INITIAL_MEMBER()])
                toast.success('Form reset')
              }}
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
