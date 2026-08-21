import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../utils/api'
import toast from 'react-hot-toast'

const meetingTypes = ['1st DC Meeting', '2nd DC Meeting', '3rd DC Meeting', 'Annual Review', 'Pre-Synopsis', 'Comprehensive Viva']
const venueOptions = ['Conference Room B, Block-IV, 2nd Floor', 'Online - Google Meet', 'Online - Zoom', 'Seminar Hall A', 'Department Conference Room']

export default function ScheduleDCMeeting() {
  const { user } = useAuth()
  const [scholars, setScholars] = useState([])
  const [selectedScholar, setSelectedScholar] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    async function loadScholars() {
      try {
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
            id: s.profile?.regNo || s.id || s._id,
            name: s.name,
            dept: s.dept || 'Computer Science',
            status: s.status === 'Active' ? 'Active Scholar' : 'Inactive'
          }))

          setScholars(myScholars)
          if (myScholars.length > 0) {
            setSelectedScholar(myScholars[0])
            setSearchTerm(myScholars[0].name)
          }
        }
      } catch (err) {
        console.error('Failed to load scholars for scheduling', err)
      }
    }
    if (user) loadScholars()
  }, [user])
  const [form, setForm] = useState({
    meetingType: '1st DC Meeting',
    date: '',
    time: '',
    venue: '',
    mode: 'offline',
    customVenue: '',
    agenda: '',
  })
  const [documents, setDocuments] = useState([
    { name: 'E_Rodriguez_Synopsis_Draft.pdf', size: '3.2 MB', uploaded: '2 hours ago' },
    { name: 'Previous_Meeting_Minutes.docx', size: '1.2 MB', uploaded: '7 hours ago' },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      uploaded: 'Just now',
    }))
    setDocuments(prev => [...prev, ...newFiles])
    toast.success(`${newFiles.length} file(s) uploaded!`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.date || !form.time) {
      toast.error('Please fill date and time fields')
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('DC Meeting scheduled successfully!')
    setSubmitting(false)
  }

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Schedule DC Meeting</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Schedule a new Doctoral Committee meeting for a scholar
          </span>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Main Form */}
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            {/* Scholar Selection */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👥</span> Scholar Selection
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Ensure all required documents for the committee review are uploaded.</div>
                </div>
              </div>
              <div className="card-body">
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Search Scholar Name or ID</label>
                <div style={{ position: 'relative' }}>
                  <input
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setShowDropdown(true) }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder="e.g. Elena Rodriguez or PH2023-088"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                  {showDropdown && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', zIndex: 50,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)', marginTop: '4px',
                    }}>
                      {scholars.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm)).map(s => (
                        <div
                          key={s.id}
                          onMouseDown={() => { setSelectedScholar(s); setSearchTerm(s.name); setShowDropdown(false) }}
                          style={{
                            padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            borderBottom: '1px solid var(--border)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PHD {s.id} | {s.dept}</div>
                          </div>
                          <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px' }}>{s.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedScholar && (
                  <div style={{
                    marginTop: '12px', padding: '12px 16px',
                    background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                        {selectedScholar.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{selectedScholar.name}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>PHD {selectedScholar.id} | {selectedScholar.dept}</div>
                      </div>
                    </div>
                    <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>Active Scholar</span>
                  </div>
                )}
              </div>
            </div>

            {/* Meeting Details */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header">
                <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋</span> Meeting Details
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Meeting Type</label>
                    <select
                      value={form.meetingType}
                      onChange={e => setForm(p => ({ ...p, meetingType: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: '#fff' }}
                    >
                      {meetingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Time</label>
                    <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Venue & Mode */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header">
                <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📍</span> Venue & Mode
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: '24px', marginBottom: '14px' }}>
                  {[{ label: 'Offline / In-Person', val: 'offline' }, { label: 'Online / Virtual', val: 'online' }].map(o => (
                    <label key={o.val} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      <input type="radio" name="mode" value={o.val} checked={form.mode === o.val} onChange={() => setForm(p => ({ ...p, mode: o.val }))} />
                      {o.label}
                    </label>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Venue / Room Number</label>
                  <input
                    list="venue-options"
                    value={form.venue}
                    onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
                    placeholder={form.mode === 'offline' ? 'e.g. Conference Room B, Block-IV, 2nd Floor' : 'e.g. Zoom Meeting Link'}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                  <datalist id="venue-options">
                    {venueOptions.map(v => <option key={v} value={v} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="card-header">
                <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📝</span> Agenda & Remarks
                </div>
              </div>
              <div className="card-body">
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Objectives of the Meeting</label>
                <textarea
                  value={form.agenda}
                  onChange={e => setForm(p => ({ ...p, agenda: e.target.value }))}
                  placeholder="Briefly outline the points to be discussed or specific objectives for this session..."
                  rows={4}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{
              background: '#F0F9FF', border: '1px solid #BAE6FD',
              borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px',
              fontSize: '12px', color: '#0369A1', lineHeight: 1.6,
            }}>
              📌 Note: Once scheduled, an automated calendar invite will be sent to the scholar and all DC committee members. You can modify the details up to 24 hours before the meeting start time.
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost">Cancel</button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '10px 28px', borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(90deg, #4F46E5, #6C63FF)', color: '#fff',
                  fontWeight: 700, fontSize: '13.5px', border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
                }}
              >
                {submitting ? '⏳ Scheduling...' : '📅 Schedule Meeting'}
              </button>
            </div>
          </form>

          {/* Right Panel - Minutes Upload */}
          <div style={{ width: '320px', flexShrink: 0 }}>
            <div className="card">
              <div className="card-header">
                <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📄</span> Minutes Upload
                </div>
              </div>
              <div className="card-body">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Ensure all meeting minutes and review documents are uploaded.
                </div>
                {/* Upload Zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files) }}
                  onClick={() => document.getElementById('fileInput').click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#4F46E5' : '#CBD5E1'}`,
                    borderRadius: 'var(--radius-md)', padding: '28px 20px', textAlign: 'center',
                    cursor: 'pointer', background: dragOver ? '#EEF2FF' : '#FAFAFA',
                    marginBottom: '14px', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>Click to upload or drag & drop</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>PDF, DOCX up to 15MB</div>
                  <input id="fileInput" type="file" multiple style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files)} />
                </div>
                {/* Uploaded Files */}
                {documents.map((doc, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', background: '#F8FAFC',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Uploaded {doc.uploaded} • {doc.size}</div>
                    </div>
                    <button onClick={() => setDocuments(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '14px' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Insights */}
            <div className="card" style={{ marginTop: '16px' }}>
              <div className="card-header">
                <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💡</span> System Insights
                </div>
              </div>
              <div className="card-body" style={{ padding: '12px 16px' }}>
                {[
                  { icon: '⚠️', color: '#FEF3C7', text: 'The Comprehensive Viva for Elena Rodriguez is overdue by 12 days. Prioritize this meeting.' },
                  { icon: '✅', color: '#D1FAE5', text: '6 external committee members have been notified and updated their availability calendars.' },
                  { icon: '🔑', color: '#DBEAFE', text: 'Supervisor credentials for DC moderation are valid until Oct 2025.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '8px', padding: '8px 10px',
                    background: item.color, borderRadius: 'var(--radius-sm)',
                    marginBottom: i < 2 ? '8px' : 0,
                  }}>
                    <span style={{ fontSize: '13px', flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
