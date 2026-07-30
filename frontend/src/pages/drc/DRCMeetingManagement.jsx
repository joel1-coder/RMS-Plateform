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
  { id: 1, type: 'Viva Voce', scholar: 'Rahul Sharma', panel: 'Dr. Mohan Reddy, Prof. R. Iyer', date: '2024-07-25', time: '10:00 AM', venue: 'Board Room 1', status: 'Scheduled' },
  { id: 2, type: 'Synopsis Review', scholar: 'Neha Patel', panel: 'Dr. A. Sharma, Prof. K. Das', date: '2024-06-15', time: '02:00 PM', venue: 'Conference Room 2', status: 'Completed' },
  { id: 3, type: 'Doctoral Committee', scholar: 'Amit Kumar', panel: 'Dr. Mohan Reddy', date: '2024-08-10', time: '11:00 AM', venue: 'Seminar Hall', status: 'Scheduled' },
  { id: 4, type: 'Progress Review', scholar: 'Sonal Joshi', panel: 'Prof. P. Singh (External)', date: '2024-08-12', time: '09:30 AM', venue: 'Virtual - Meet Link', status: 'Scheduled' },
]

const MEETING_TYPES = ['Synopsis Review', 'Defense Evaluation', 'Bi-Annual Progress', 'Viva Voce', 'Other']

function DRCMeetingModal({ onClose, onSave, editData = null }) {
  const [form, setForm] = useState({
    scholar: '',
    type: 'Synopsis Review',
    date: '',
    time: '',
    venue: '',
    panel: 'CS & AI Evaluation Panel',
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
        type: editData.type || 'Synopsis Review',
        date: editData.date || '',
        time: editData.time || '',
        venue: editData.venue || '',
        panel: editData.panel || 'CS & AI Evaluation Panel',
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
    if (!form.scholar || !form.date || !form.time) {
      toast.error('Scholar name, date and time are required')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{editData ? 'Edit DRC Review Session' : 'Schedule DRC Review Session'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1 / -1', position: 'relative' }} ref={scholarRef}>
                <label className="form-label">Scholar Candidate *</label>
                <input
                  name="scholar"
                  required
                  autoComplete="off"
                  className="form-control"
                  placeholder="Type to search scholar..."
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
                        onMouseEnter={e => e.currentTarget.style.background = '#F0FDF4'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0D9488, #10B981)',
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
                {showScholarDrop && filteredScholars.length === 0 && scholarSearch && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
                    background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '12px 14px',
                    fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px'
                  }}>
                    No scholars found. You can still type a name manually.
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Evaluation Type</label>
                <select name="type" className="form-control form-select" value={form.type} onChange={handleChange}>
                  {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Room / Venue</label>
                <input name="venue" className="form-control" placeholder="e.g. Conference Hall A or Zoom Link" value={form.venue} onChange={handleChange} />
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
                <label className="form-label">DRC Committee Board / Panel</label>
                <input name="panel" className="form-control" placeholder="e.g. CS & AI Evaluation Panel" value={form.panel} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Status</label>
                <select name="status" className="form-control form-select" value={form.status} onChange={handleChange}>
                  {['Scheduled', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#0D9488', borderColor: '#0D9488' }}>
              {editData ? 'Save Changes' : 'Schedule Session'}
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
  const [filterType, setFilterType] = useState('All')

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
      toast.success('DRC Review Session updated!')
      setEditingMeeting(null)
    } else {
      const newMeeting = { ...formData, id: Date.now() }
      saveToStorage([newMeeting, ...meetings])
      toast.success('DRC Review Session scheduled successfully!')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Cancel and delete this DRC review session?')) {
      saveToStorage(meetings.filter(m => m.id !== id))
      toast.success('Session removed')
    }
  }

  const filtered = meetings.filter(m => {
    const sTerm = search.toLowerCase()
    const scholarName = m.scholar || ''
    const mType = m.type || ''
    const matchSearch = scholarName.toLowerCase().includes(sTerm) || mType.toLowerCase().includes(sTerm)
    const matchType = filterType === 'All' || m.type === filterType
    return matchSearch && matchType
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
          <div className="topbar-title">DRC Meeting Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Schedule and coordinate research defense and synopsis assessment panels</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: '#0D9488', borderColor: '#0D9488' }} onClick={() => setShowModal(true)}>
            ＋ Schedule Session
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input className="form-control" placeholder="Search scholar or type..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control form-select" style={{ width: '180px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option>All</option>
              {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Committee / Session</th>
                  <th>Scholar / Candidate</th>
                  <th>Schedule</th>
                  <th>Room / Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>📅</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{m.panel || 'Evaluation Committee'}</div>
                          <span className="badge badge-info" style={{ fontSize: '9px', padding: '1px 5px', background: '#E0F2FE', color: '#0369A1' }}>{m.type}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{m.scholar}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{m.date}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.time}</div>
                    </td>
                    <td>
                      <span className="badge badge-warning" style={{ fontSize: '11px', background: '#FEF3C7', color: '#D97706' }}>{m.venue || 'TBD'}</span>
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'Completed' ? 'badge-success' : m.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingMeeting(m)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }} onClick={() => handleDelete(m.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
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
