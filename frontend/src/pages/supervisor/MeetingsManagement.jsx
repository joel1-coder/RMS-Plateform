import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const DEFAULT_MEETINGS = [
  { id: 1, type: 'Viva Voce', scholar: 'Rahul Sharma', panel: 'Dr. Mohan Reddy, Prof. R. Iyer', date: '2024-07-25', time: '10:00 AM', venue: 'Board Room 1', status: 'Scheduled' },
  { id: 2, type: 'Synopsis Review', scholar: 'Neha Patel', panel: 'Dr. A. Sharma, Prof. K. Das', date: '2024-06-15', time: '02:00 PM', venue: 'Conference Room 2', status: 'Completed' },
  { id: 3, type: 'Doctoral Committee', scholar: 'Amit Kumar', panel: 'Dr. Mohan Reddy', date: '2024-08-10', time: '11:00 AM', venue: 'Seminar Hall', status: 'Scheduled' },
]

function ScheduleMeetingModal({ onClose, onSave, editData = null, scholarOptions = [] }) {
  const [form, setForm] = useState({
    scholar: '',
    type: 'Regular Review',
    date: '',
    time: '',
    venue: '',
    panel: '',
    status: 'Scheduled'
  })

  useEffect(() => {
    if (editData) {
      setForm(editData)
    } else if (scholarOptions.length > 0) {
      setForm(f => ({ ...f, scholar: scholarOptions[0].name }))
    }
  }, [editData, scholarOptions])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.scholar || !form.date || !form.time) {
      toast.error('Scholar, Date, and Time are required fields')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{editData ? 'Edit Scheduled Meeting' : 'Schedule New Meeting'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Select Scholar *</label>
                {scholarOptions.length === 0 ? (
                  <input name="scholar" required className="form-control" placeholder="e.g. Scholar Name" value={form.scholar} onChange={handleChange} />
                ) : (
                  <select name="scholar" className="form-control form-select" value={form.scholar} onChange={handleChange}>
                    {scholarOptions.map(s => <option key={s.id} value={s.name}>{s.name} ({s.dept})</option>)}
                  </select>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Meeting Type</label>
                <select name="type" className="form-control form-select" value={form.type} onChange={handleChange}>
                  {['Regular Review', 'Synopsis Review', 'Doctoral Committee', 'Viva Voce Preparation', 'Other'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Venue / Link</label>
                <input name="venue" className="form-control" placeholder="e.g. Virtual or Room 102" value={form.venue} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input name="date" type="date" required className="form-control" value={form.date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <input name="time" type="time" required className="form-control" value={form.time} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Assigned Panel / Agenda Notes</label>
                <input name="panel" className="form-control" placeholder="e.g. Regular monthly research assessment" value={form.panel} onChange={handleChange} />
              </div>
              {editData && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Status</label>
                  <select name="status" className="form-control form-select" value={form.status} onChange={handleChange}>
                    {['Scheduled', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>
              {editData ? 'Save Changes' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MeetingsManagement() {
  const { user } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [myScholars, setMyScholars] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState(null)

  useEffect(() => {
    if (!user) return

    // 1. Fetch assigned scholars names for matching relevant meetings
    let dbUsers = []
    try {
      const rawUsers = localStorage.getItem('rms_all_users')
      if (rawUsers) dbUsers = JSON.parse(rawUsers)
    } catch {}

    const assigned = dbUsers.filter(
      u => u.role === 'Scholar' &&
           u.assignedSupervisor &&
           u.assignedSupervisor.toLowerCase() === user.name.toLowerCase()
    )
    setMyScholars(assigned)

    // 2. Fetch meetings
    let allMeetings = []
    try {
      const stored = localStorage.getItem('rms_meetings')
      if (stored) {
        allMeetings = JSON.parse(stored)
      } else {
        allMeetings = DEFAULT_MEETINGS
        localStorage.setItem('rms_meetings', JSON.stringify(DEFAULT_MEETINGS))
      }
    } catch {
      allMeetings = DEFAULT_MEETINGS
    }

    setMeetings(allMeetings)
  }, [user])

  const saveToStorage = (updated) => {
    setMeetings(updated)
    localStorage.setItem('rms_meetings', JSON.stringify(updated))
  }

  const handleSave = (formData) => {
    if (editingMeeting) {
      const updated = meetings.map(m => m.id === editingMeeting.id ? { ...m, ...formData } : m)
      saveToStorage(updated)
      toast.success('Meeting details updated!')
      setEditingMeeting(null)
    } else {
      const newMeeting = { 
        ...formData, 
        id: Date.now(), 
        supervisor: user.name 
      }
      saveToStorage([newMeeting, ...meetings])
      toast.success('Meeting scheduled successfully!')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this scheduled meeting?')) {
      saveToStorage(meetings.filter(m => m.id !== id))
      toast.success('Meeting removed.')
    }
  }

  // Filter meetings related to this supervisor's scholars
  const myScholarsNames = myScholars.map(s => s.name.toLowerCase())
  const supervisorName = user?.name ? user.name.toLowerCase() : ''

  const myMeetings = meetings.filter(m => {
    const sName = (m.scholar || '').toLowerCase()
    const mSup = (m.supervisor || '').toLowerCase()
    const inPanel = (m.panel || '').toLowerCase().includes(supervisorName)
    return myScholarsNames.includes(sName) || mSup === supervisorName || inPanel
  })

  // Get status color coding
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success'
      case 'Cancelled': return 'badge-danger'
      default: return 'badge-warning'
    }
  }

  // Calendar render highlights
  const getEventForDate = (dateNum) => {
    // Look for matching meetings scheduled in July 2024 (matching index page)
    const match = myMeetings.find(m => {
      if (!m.date) return false
      const parts = m.date.split('-')
      if (parts.length === 3 && parts[1] === '07') {
        return Number(parts[2]) === dateNum
      }
      return false
    })
    return match
  }

  return (
    <div className="animate-fade">
      {(showModal || editingMeeting) && (
        <ScheduleMeetingModal
          editData={editingMeeting}
          scholarOptions={myScholars}
          onClose={() => { setShowModal(false); setEditingMeeting(null) }}
          onSave={handleSave}
        />
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Meetings Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Schedule, track and coordinate research reviews with your assigned scholars
          </span>
        </div>
        <div className="topbar-actions">
          <button 
            className="btn btn-primary btn-sm" 
            style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} 
            onClick={() => setShowModal(true)}
          >
            ＋ Schedule New Meeting
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Mini Grid */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'My Total Meetings', value: `${myMeetings.length} Scheduled`, icon: '📅', color: 'blue' },
            { label: 'Upcoming Reviews', value: `${myMeetings.filter(m => m.status === 'Scheduled').length} Upcoming`, icon: '⏰', color: 'orange' },
            { label: 'Completed', value: `${myMeetings.filter(m => m.status === 'Completed').length} Done`, icon: '✅', color: 'green' },
            { label: 'Supervised Scholars', value: `${myScholars.length} Candidates`, icon: '👥', color: 'purple' },
          ].map((s, i) => (
            <div className="stat-card" key={i} style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Calendar Widget */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 800, fontSize: '15px' }}>July 2024</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>Month</button>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>Week</button>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>Day</button>
              </div>
            </div>
            
            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', paddingBottom: '6px' }}>{day}</div>
              ))}
              
              {/* Render 31 days for July 2024 */}
              {Array.from({ length: 31 }).map((_, idx) => {
                const dateNum = idx + 1
                const meeting = getEventForDate(dateNum)
                return (
                  <div key={idx} style={{ 
                    height: '58px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', 
                    padding: '4px', textAlign: 'left', background: meeting ? '#EEF2FF' : 'transparent',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>{dateNum}</span>
                    {meeting && (
                      <span 
                        title={`${meeting.scholar}: ${meeting.type}`}
                        style={{ 
                          fontSize: '8.5px', background: meeting.status === 'Completed' ? '#10B981' : '#6C63FF', color: '#fff', 
                          padding: '2px 4px', borderRadius: '4px', fontWeight: 700,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer'
                        }}
                      >
                        {meeting.time || 'All Day'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Upcoming Meetings Queue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <div className="card-header" style={{ padding: '12px 16px' }}>
                <span className="card-title" style={{ fontSize: '13px' }}>My Scheduled Meetings</span>
                <span style={{ fontSize: '11.5px', color: '#6C63FF', fontWeight: 700 }}>Active</span>
              </div>
              <div style={{ padding: '0 16px 12px' }}>
                {myMeetings.map(meeting => (
                  <div key={meeting.id} style={{ 
                    padding: '12px 0', borderBottom: '1px solid var(--border)', 
                    display: 'flex', gap: '10px', alignItems: 'flex-start' 
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: '#EDE9FE', color: '#4F46E5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, fontWeight: 700
                    }}>
                      {meeting.scholar ? meeting.scholar.charAt(0) : 'S'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{meeting.scholar}</span>
                        <span className={`badge ${getStatusBadge(meeting.status)}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                          {meeting.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#6C63FF', fontWeight: 600 }}>{meeting.type}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{meeting.panel || meeting.venue}</div>
                      
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                        <span>📅 {meeting.date}</span>
                        <span>⏰ {meeting.time}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setEditingMeeting(meeting)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px', color: '#EF4444' }} onClick={() => handleDelete(meeting.id)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                ))}

                {myMeetings.length === 0 && (
                  <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                    No upcoming meetings scheduled.
                  </div>
                )}
              </div>
            </div>

            {/* Resources card */}
            <div className="card card-body" style={{ background: '#0F172A', color: '#fff' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Meeting Resources</div>
              <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginBottom: '10px' }}>
                Access guidelines, agenda rubrics, and virtual defense materials for supervisor reviews.
              </p>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10B981', cursor: 'pointer' }} onClick={() => toast.success('Rubrics downloaded.')}>
                Browse Assessment Rubrics →
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
