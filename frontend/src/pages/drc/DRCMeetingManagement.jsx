import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

// Load scholars from localStorage (rms_all_users, role === 'scholar')
function loadScholars() {
  try {
    const raw = localStorage.getItem('rms_all_users')
    if (raw) {
      return JSON.parse(raw)
        .filter(u => (u.role || '').toLowerCase() === 'scholar')
        .map(u => ({ id: u.id, name: u.name, dept: u.dept || '' }))
    }
  } catch { /* ignore */ }
  // Fallback defaults
  return [
    { id: 1, name: 'Rahul Sharma', dept: 'Computer Science' },
    { id: 5, name: 'Neha Patel', dept: 'Electronics' },
    { id: 7, name: 'Amit Kumar', dept: 'Civil' },
  ]
}

const DEFAULT_MEETINGS = [
  { id: 1, scholar: 'Rahul Sharma', date: '2024-07-25', time: '10:00 AM', venue: 'Board Room 1', panel: 'Viva Voce Examination Board', status: 'Scheduled' },
  { id: 2, scholar: 'Neha Patel', date: '2024-06-15', time: '02:00 PM', venue: 'Conference Room 2', panel: 'Synopsis Presentation Board', status: 'Completed' },
  { id: 3, scholar: 'Amit Kumar', date: '2024-08-10', time: '11:00 AM', venue: 'Seminar Hall', panel: 'Doctoral Committee Review', status: 'Scheduled' },
  { id: 4, scholar: 'Sonal Joshi', date: '2024-08-12', time: '09:30 AM', venue: 'Virtual - Meet Link', panel: 'First Year Progress Assessment', status: 'Scheduled' },
]

function DRCMeetingModal({ onClose, onSave, editData = null }) {
  const [form, setForm] = useState({
    scholar: '',
    date: '',
    time: '',
    venue: '',
    panel: '',
    status: 'Scheduled'
  })

  const [scholars, setScholars] = useState([])
  const [scholarSearch, setScholarSearch] = useState('')
  const [showScholarDrop, setShowScholarDrop] = useState(false)
  const scholarRef = useRef(null)

  useEffect(() => {
    setScholars(loadScholars())
  }, [])

  useEffect(() => {
    if (editData) {
      setForm({
        scholar: editData.scholar || '',
        date: editData.date || '',
        time: editData.time || '',
        venue: editData.venue || '',
        panel: editData.panel || '',
        status: editData.status || 'Scheduled'
      })
      setScholarSearch(editData.scholar || '')
    }
  }, [editData])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (scholarRef.current && !scholarRef.current.contains(e.target)) {
        setShowScholarDrop(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredScholars = scholars.filter(s =>
    s.name.toLowerCase().includes(scholarSearch.toLowerCase()) ||
    (s.dept || '').toLowerCase().includes(scholarSearch.toLowerCase())
  )

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.scholar || !form.date || !form.time || !form.venue || !form.panel) {
      toast.error('All fields are required')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Meeting Schedule</span>
          <button className="modal-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* 1. Candidate Name */}
              <div className="form-group" style={{ position: 'relative' }} ref={scholarRef}>
                <label className="form-label">Candidate Name *</label>
                <input
                  name="scholar"
                  required
                  autoComplete="off"
                  className="form-control"
                  placeholder="Type to search candidate..."
                  value={scholarSearch}
                  onChange={e => {
                    setScholarSearch(e.target.value)
                    setForm({ ...form, scholar: e.target.value })
                    setShowScholarDrop(true)
                  }}
                  onFocus={() => setShowScholarDrop(true)}
                />
                {showScholarDrop && filteredScholars.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
                    background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '180px', overflowY: 'auto', marginTop: '2px'
                  }}>
                    {filteredScholars.map(s => (
                      <div
                        key={s.id}
                        onMouseDown={() => {
                          setScholarSearch(s.name)
                          setForm({ ...form, scholar: s.name })
                          setShowScholarDrop(false)
                        }}
                        style={{
                          padding: '9px 14px', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', gap: '10px',
                          borderBottom: '1px solid var(--border)',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#E7F4EC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #174EA6, #1E7D45)',
                          color: '#fff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0
                        }}>{s.name.charAt(0)}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{s.name}</div>
                          {s.dept && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.dept}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Meeting Date, Time and Venue */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Meeting Date *</label>
                  <input name="date" type="date" required className="form-control" value={form.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Meeting Time *</label>
                  <input name="time" type="time" required className="form-control" value={form.time} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue *</label>
                <input name="venue" required className="form-control" placeholder="e.g. Conference Hall A or Zoom Link" value={form.venue} onChange={handleChange} />
              </div>

              {/* 3. Regards Title */}
              <div className="form-group">
                <label className="form-label">Regards Title *</label>
                <input name="panel" required className="form-control" placeholder="e.g. Synopsis Review / Thesis Assessment" value={form.panel} onChange={handleChange} />
              </div>

              {/* 4. Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control form-select" value={form.status} onChange={handleChange}>
                  {['Scheduled', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#174EA6', borderColor: '#174EA6' }}>
              {editData ? 'Save Changes' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DRCMeetingManagement() {
  const [meetings, setMeetings] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rms_meetings')
      if (stored) {
        setMeetings(JSON.parse(stored))
      } else {
        setMeetings(DEFAULT_MEETINGS)
        localStorage.setItem('rms_meetings', JSON.stringify(DEFAULT_MEETINGS))
      }
    } catch {
      setMeetings(DEFAULT_MEETINGS)
    }
  }, [])

  const saveToStorage = (updated) => {
    setMeetings(updated)
    localStorage.setItem('rms_meetings', JSON.stringify(updated))
  }

  const handleSave = (formData) => {
    if (editingMeeting) {
      const updated = meetings.map(m => m.id === editingMeeting.id ? { ...m, ...formData } : m)
      saveToStorage(updated)
      toast.success('Meeting updated!')
      setEditingMeeting(null)
    } else {
      const newMeeting = { ...formData, id: Date.now() }
      saveToStorage([newMeeting, ...meetings])
      toast.success('Meeting scheduled successfully!')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Cancel and delete this scheduled meeting?')) {
      saveToStorage(meetings.filter(m => m.id !== id))
      toast.success('Meeting removed')
    }
  }

  const filtered = meetings.filter(m => {
    const sTerm = search.toLowerCase()
    const scholarName = m.scholar || ''
    const panelName = m.panel || ''
    return scholarName.toLowerCase().includes(sTerm) || panelName.toLowerCase().includes(sTerm)
  })

  return (
    <div className="animate-fade">
      {(showModal || editingMeeting) && (
        <DRCMeetingModal
          editData={editingMeeting}
          onClose={() => { setShowModal(false); setEditingMeeting(null) }}
          onSave={handleSave}
        />
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Meeting Schedule</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Coordinate and list scheduled Doctoral Research Committee reviews</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: '#174EA6', borderColor: '#174EA6' }} onClick={() => setShowModal(true)}>
            + Meeting Schedule
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon"></span>
              <input className="form-control" placeholder="Search candidate or title..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Meeting Date, Time & Venue</th>
                  <th>Regards Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    {/* 1. Candidate Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #174EA6, #0A2A66)',
                          color: '#fff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: 700, fontSize: '13px'
                        }}>{(m.scholar || 'S').charAt(0)}</span>
                        <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{m.scholar}</div>
                      </div>
                    </td>

                    {/* 2. Meeting Date, Time & Venue */}
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{m.date}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.time}</div>
                      <div style={{ fontSize: '11px', color: '#174EA6', marginTop: '2px', fontWeight: 600 }}> {m.venue || 'TBD'}</div>
                    </td>

                    {/* 3. Regards Title */}
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{m.panel || 'Review Session'}</div>
                    </td>

                    {/* 4. Status */}
                    <td>
                      <span className={`badge ${m.status === 'Completed' ? 'badge-success' : m.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingMeeting(m)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#B4232A' }} onClick={() => handleDelete(m.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No meetings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
