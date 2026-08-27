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

const genderOptions = ['Male', 'Female', 'Other']
const categoryOptions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Reader', 'Research Scientist']

export default function DCMembersManagement() {
  const { user } = useAuth()
  const [scholarsList, setScholarsList] = useState([])
  const [selectedScholarReg, setSelectedScholarReg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState({})
  const [promptRestore, setPromptRestore] = useState(null) // { cardId, member }
  const [loading, setLoading] = useState(true)

  // Start with 2 completely clean, blank member cards
  const [dcMembers, setDcMembers] = useState([INITIAL_MEMBER(), INITIAL_MEMBER()])

  // Clean up legacy hardcoded demo entries on mount
  useEffect(() => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(k => {
        if (k.startsWith('rms_dc_members_BDU2020410504') || k.startsWith('rms_dc_members_BDU2020410331')) {
          const val = localStorage.getItem(k)
          if (val && val.includes('DEIVANAYAGAM')) {
            localStorage.removeItem(k)
          }
        }
      })
    } catch {
      // ignore
    }
  }, [])

  // Load scholars for supervisor
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
    regNo: '-',
    discipline: '-',
    status: 'PENDING'
  }

  // Sync DC members when selected scholar changes
  useEffect(() => {
    if (!selectedScholarReg) return
    const stored = localStorage.getItem(`rms_dc_members_${selectedScholarReg}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDcMembers(parsed)
          return
        }
      } catch (e) {
        console.error(e)
      }
    }
    // Default to clean blank cards
    setDcMembers([INITIAL_MEMBER(), INITIAL_MEMBER()])
  }, [selectedScholarReg])

  // Get cached pool of DC members saved by this supervisor
  const getCachedMembersPool = () => {
    try {
      const poolStr = localStorage.getItem('rms_cached_dc_members_pool')
      if (poolStr) {
        const pool = JSON.parse(poolStr)
        if (Array.isArray(pool)) return pool
      }
    } catch {
      // ignore
    }
    return []
  }

  const cachedMembersPool = getCachedMembersPool()

  const handleMemberChange = (id, field, value) => {
    setDcMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  // Handle typing name: check if matched in cache pool
  const handleNameChange = (cardId, typedName) => {
    handleMemberChange(cardId, 'name', typedName)
    const cleanTyped = typedName.trim().toLowerCase()

    if (!cleanTyped) {
      if (promptRestore?.cardId === cardId) setPromptRestore(null)
      return
    }

    // Find if an exact or strong partial match exists in the cache pool
    const matched = cachedMembersPool.find(p => p.name.trim().toLowerCase() === cleanTyped)
    if (matched) {
      // Check if current card is blank in other fields
      const currentCard = dcMembers.find(m => m.id === cardId)
      if (currentCard && !currentCard.department && !currentCard.collegeInstitution) {
        setPromptRestore({ cardId, member: matched })
        return
      }
    }

    if (promptRestore?.cardId === cardId) {
      setPromptRestore(null)
    }
  }

  // Apply restored cached data to card
  const applyRestoreData = (cardId, matchedMember) => {
    setDcMembers(prev => prev.map(m => m.id === cardId ? {
      ...m,
      name: matchedMember.name,
      idDesignation: matchedMember.idDesignation || '',
      gender: matchedMember.gender || 'Male',
      category: matchedMember.category || 'Assistant Professor',
      department: matchedMember.department || '',
      collegeInstitution: matchedMember.collegeInstitution || '',
      pincode: matchedMember.pincode || '',
      city: matchedMember.city || '',
      email: matchedMember.email || '',
      mobile: matchedMember.mobile || '',
    } : m))
    setPromptRestore(null)
    toast.success(`Restored previously saved details for ${matchedMember.name}`)
  }

  const handleAddMember = () => {
    if (dcMembers.length >= 6) {
      toast.error('Maximum 6 DC Members allowed per committee')
      return
    }
    setDcMembers(prev => [...prev, INITIAL_MEMBER()])
  }

  const handleRemoveMember = (id) => {
    if (dcMembers.length <= 2) {
      toast.error('A minimum of 2 DC Members are mandatory for the committee')
      return
    }
    setDcMembers(prev => prev.filter(m => m.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedScholarReg) {
      toast.error('Please select a scholar first')
      return
    }

    // Validate at least 2 members have name, dept, college
    for (let i = 0; i < dcMembers.length; i++) {
      const m = dcMembers[i]
      if (!m.name.trim() || !m.department.trim() || !m.collegeInstitution.trim()) {
        toast.error(`Please fill in required details (Name, Department, College) for DC Member ${i + 1}`)
        return
      }
    }

    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))

    // 1. Save this scholar's committee
    localStorage.setItem(`rms_dc_members_${selectedScholarReg}`, JSON.stringify(dcMembers))

    // 2. Cache each DC member profile into rms_cached_dc_members_pool
    const existingPool = getCachedMembersPool()
    const poolMap = new Map()
    existingPool.forEach(p => {
      if (p.name) poolMap.set(p.name.trim().toLowerCase(), p)
    })

    dcMembers.forEach(m => {
      if (m.name && m.name.trim()) {
        poolMap.set(m.name.trim().toLowerCase(), {
          name: m.name.trim(),
          idDesignation: m.idDesignation || '',
          gender: m.gender || 'Male',
          category: m.category || 'Assistant Professor',
          department: m.department || '',
          collegeInstitution: m.collegeInstitution || '',
          pincode: m.pincode || '',
          city: m.city || '',
          email: m.email || '',
          mobile: m.mobile || '',
        })
      }
    })

    const updatedPool = Array.from(poolMap.values())
    localStorage.setItem('rms_cached_dc_members_pool', JSON.stringify(updatedPool))

    toast.success(`DC Constitution saved & ${dcMembers.length} member profiles cached for ${activeScholar.name}!`)
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
          background: 'linear-gradient(90deg, #174EA6 0%, #0A2A66 100%)',
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
                  fontSize: '14px', fontWeight: 700, color: '#061B44', background: '#fff',
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
            <span style={{ background: activeScholar.status === 'APPROVED' ? '#1E7D45' : '#C89B1E', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '5px 14px', borderRadius: '99px' }}>
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
            <span style={{ color: '#C89B1E', fontSize: '18px', flexShrink: 0 }} />
            <div style={{ fontSize: '12.5px', color: '#92400E', lineHeight: 1.6 }}>
              <strong>Smart Auto-Cache Instructions:</strong><br />
              - When you enter and save a DC member's details once, they will be cached.<br />
              - Whenever you type that member's name for another scholar, you will be prompted to auto-fill their previously saved data.<br />
              - A minimum of 2 external/internal DC Members are required to constitute the Doctoral Committee.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Header Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              Doctoral Committee Members ({dcMembers.length} Members)
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(90deg, #1E7D45, #166A3A)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 3px 10px rgba(30,125,69,0.24)',
              }}
            >
              Add DC Member Card
            </button>
          </div>

          {/* Members Dynamic Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: dcMembers.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {dcMembers.map((member, idx) => {
              const suggestions = cachedMembersPool.filter(p => 
                p.name.toLowerCase().includes((member.name || '').toLowerCase())
              )
              const hasTyped = member.name.trim().length > 0

              return (
                <div key={member.id} className="card" style={{ position: 'relative', overflow: 'visible' }}>
                  {/* Member Header */}
                  <div style={{
                    background: 'linear-gradient(90deg, #0A2A66, #174EA6)',
                    color: '#fff', padding: '12px 18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '13.5px' }}>
                      DC Member {idx + 1} {idx === 0 ? '(Research Adviser / External 1)' : idx === 1 ? '(Member 2)' : ''}
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
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="card-body" style={{ padding: '18px' }}>
                    {/* Prompt to Restore Previously Cached Data */}
                    {promptRestore && promptRestore.cardId === member.id && (
                      <div style={{
                        background: '#E8EEF8', border: '1.5px solid #174EA6',
                        borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: '16px',
                        display: 'flex', flexDirection: 'column', gap: '8px'
                      }}>
                        <div style={{ fontSize: '12.5px', color: '#0A2A66', fontWeight: 600 }}>
                          Would you like to enter the previously stored data for this DC member &ldquo;{promptRestore.member.name}&rdquo;?
                        </div>
                        <div style={{ fontSize: '11px', color: '#4B5563' }}>
                          Dept: {promptRestore.member.department} - Inst: {promptRestore.member.collegeInstitution}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ background: '#0A2A66', fontSize: '12px', padding: '4px 12px' }}
                            onClick={() => applyRestoreData(member.id, promptRestore.member)}
                          >
                            Yes, Restore Data
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '12px', padding: '4px 12px', background: '#E5E7EB' }}
                            onClick={() => setPromptRestore(null)}
                          >
                            No, Keep Blank
                          </button>
                        </div>
                      </div>
                    )}

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
                              handleNameChange(member.id, e.target.value)
                              setShowSuggestions(prev => ({ ...prev, [member.id]: true }))
                            }}
                            onFocus={() => setShowSuggestions(prev => ({ ...prev, [member.id]: true }))}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowSuggestions(prev => ({ ...prev, [member.id]: false }))
                              }, 250)
                            }}
                            style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', boxSizing: 'border-box' }}
                          />
                          
                          {/* Quick dropdown choice from cached pool */}
                          {cachedMembersPool.length > 0 && (
                            <select
                              onChange={(e) => {
                                const matched = cachedMembersPool.find(p => p.name === e.target.value)
                                if (matched) {
                                  setPromptRestore({ cardId: member.id, member: matched })
                                }
                              }}
                              value=""
                              className="form-control form-select"
                              style={{ width: '160px', padding: '8px 10px', fontSize: '12.5px', flexShrink: 0 }}
                            >
                              <option value="" disabled>Or Quick Select...</option>
                              {cachedMembersPool.map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Suggestions Dropdown panel */}
                        {showSuggestions[member.id] && hasTyped && suggestions.length > 0 && (
                          <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            background: '#fff', border: '1.5px solid #174EA6', borderRadius: '4px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, maxHeight: '200px', overflowY: 'auto',
                            marginTop: '4px'
                          }}>
                            {suggestions.map(s => (
                              <div
                                key={s.name}
                                onMouseDown={() => {
                                  setPromptRestore({ cardId: member.id, member: s })
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
                                  <strong style={{ color: '#0A2A66' }}>{s.name}</strong>
                                  <div style={{ fontSize: '11px', color: '#64748B' }}>{s.category} - {s.collegeInstitution}</div>
                                </div>
                                <span style={{ fontSize: '10px', color: '#1E7D45', alignSelf: 'center', fontWeight: 'bold' }}>Click to prompt autofill</span>
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
                            Select File
                            <input type="file" style={{ display: 'none' }} onChange={e => handleMemberChange(member.id, 'recognitionLetter', e.target.files[0])} />
                          </label>
                          {member.recognitionLetter && <span style={{ fontSize: '11px', color: '#1E7D45', fontWeight: 600 }}>Selected: {member.recognitionLetter.name}</span>}
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
                background: 'linear-gradient(90deg, #174EA6, #0A2A66)',
                color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s',
                boxShadow: '0 4px 14px rgba(23,78,166,0.28)',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit DC Constitution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
