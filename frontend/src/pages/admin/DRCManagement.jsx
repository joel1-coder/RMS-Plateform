import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const DEFAULT_MEETINGS = [
  { id: 1, type: 'Viva Voce', scholar: 'Rahul Sharma', panel: 'Dr. Mohan Reddy, Prof. R. Iyer', date: '2024-07-25', time: '10:00 AM', venue: 'Board Room 1', status: 'Scheduled' },
  { id: 2, type: 'Synopsis Review', scholar: 'Neha Patel', panel: 'Dr. A. Sharma, Prof. K. Das', date: '2024-06-15', time: '02:00 PM', venue: 'Conference Room 2', status: 'Completed' },
  { id: 3, type: 'Doctoral Committee', scholar: 'Amit Kumar', panel: 'Dr. Mohan Reddy', date: '2024-08-10', time: '11:00 AM', venue: 'Seminar Hall', status: 'Scheduled' },
  { id: 4, type: 'Progress Review', scholar: 'Sonal Joshi', panel: 'Prof. P. Singh (External)', date: '2024-08-12', time: '09:30 AM', venue: 'Virtual - Meet Link', status: 'Scheduled' },
]

const MEETING_TYPES = ['Viva Voce', 'Synopsis Review', 'Doctoral Committee', 'Progress Review', 'Other']

function AssignMeetingModal({ onClose, onSave, editData = null }) {
  const [form, setForm] = useState({
    scholar: '',
    type: 'Viva Voce',
    date: '',
    time: '',
    venue: '',
    panel: '',
    status: 'Scheduled'
  })

  useEffect(() => {
    if (editData) {
      setForm(editData)
    } else {
      setForm({
        scholar: '',
        type: 'Viva Voce',
        date: '',
        time: '',
        venue: '',
        panel: '',
        status: 'Scheduled'
      })
    }
  }, [editData])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.scholar || !form.date || !form.time) {
      toast.error('Scholar, Date, and Time are required')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{editData ? 'Edit Meeting' : 'Assign New Meeting'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Scholar Name / Topic *</label>
                <input name="scholar" required className="form-control" placeholder="e.g. Rahul Sharma" value={form.scholar} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Meeting Type</label>
                <select name="type" className="form-control form-select" value={form.type} onChange={handleChange}>
                  {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Venue / Link</label>
                <input name="venue" className="form-control" placeholder="e.g. Board Room 1" value={form.venue} onChange={handleChange} />
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
                <label className="form-label">Assigned Panel Members / Examiners</label>
                <input name="panel" className="form-control" placeholder="e.g. Dr. Mohan, Prof. Iyer" value={form.panel} onChange={handleChange} />
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
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(90deg, #6C63FF, #4F46E5)' }}>
              {editData ? 'Save Changes' : 'Assign Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MeetingManagement() {
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
      toast.success('Meeting updated!')
      setEditingMeeting(null)
    } else {
      const newMeeting = { ...formData, id: Date.now() }
      saveToStorage([newMeeting, ...meetings])
      toast.success('Meeting assigned successfully!')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this meeting?')) {
      saveToStorage(meetings.filter(m => m.id !== id))
      toast.success('Meeting removed')
    }
  }

  const filtered = meetings.filter(m => {
    const matchSearch = m.scholar.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' || m.type === filterType
    return matchSearch && matchType
  })

  return (
    <div className="animate-fade">
      {(showModal || editingMeeting) && (
        <AssignMeetingModal
          editData={editingMeeting}
          onClose={() => { setShowModal(false); setEditingMeeting(null) }}
          onSave={handleSave}
        />
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Meeting & Viva Assigning</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Assign and schedule meetings for scholars (Viva Voce, DRC, etc.)</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg, #6C63FF, #4F46E5)' }} onClick={() => setShowModal(true)}>
            ＋ Assign Meeting
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Total Meetings', value: meetings.length, icon: '📅', color: 'purple' },
            { label: 'Upcoming', value: meetings.filter(m => m.status === 'Scheduled').length, icon: '⏰', color: 'orange' },
            { label: 'Completed', value: meetings.filter(m => m.status === 'Completed').length, icon: '✅', color: 'green' },
            { label: 'Viva Voce', value: meetings.filter(m => m.type === 'Viva Voce').length, icon: '🎓', color: 'blue' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
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
                  <th>Type</th>
                  <th>Scholar</th>
                  <th>Date & Time</th>
                  <th>Venue / Link</th>
                  <th>Panel</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{m.type}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{m.scholar}</td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{m.date}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.time}</div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{m.venue}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '200px' }}>{m.panel}</td>
                    <td>
                      <span className={`badge ${m.status === 'Completed' ? 'badge-success' : m.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-secondary btn-sm" title="Edit" onClick={() => setEditingMeeting(m)}>✏️</button>
                        <button className="btn btn-ghost btn-sm" title="Delete" style={{ color: '#EF4444' }} onClick={() => handleDelete(m.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
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
