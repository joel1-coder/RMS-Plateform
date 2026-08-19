import { apiFetch } from '../../utils/api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

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
          <span className="modal-title">{editData ? 'Edit Meeting Details' : 'Assign New Meeting'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Scholar Name / Topic *</label>
                <input name="scholar" required className="form-control" placeholder="e.g. Rahul Sharma" value={form.scholar} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Meeting Type</label>
                <select name="type" className="form-control form-select" value={form.type} onChange={handleChange}>
                  {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Venue / Link</label>
                <input name="venue" className="form-control" placeholder="e.g. Board Room 1" value={form.venue} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Date *</label>
                <input name="date" type="date" required className="form-control" value={form.date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Time *</label>
                <input name="time" type="time" required className="form-control" value={form.time} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Assigned Panel Members / Examiners</label>
                <input name="panel" className="form-control" placeholder="e.g. Dr. Mohan, Prof. Iyer" value={form.panel} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Status</label>
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
  const [loading, setLoading] = useState(true)

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch('/api/meetings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setMeetings(data)
    } catch {
      toast.error('Failed to load scheduled meetings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem('rms_token')
      const isEdit = !!editingMeeting
      const url = isEdit ? `/api/meetings/${editingMeeting.id || editingMeeting._id}` : '/api/meetings'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Operation failed')
      }

      toast.success(isEdit ? 'Meeting rescheduled successfully!' : 'Meeting scheduled and scholar notified!')
      setEditingMeeting(null)
      setShowModal(false)
      fetchMeetings()
    } catch (err) {
      toast.error(err.message || 'Failed to save meeting details')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meeting schedule?')) return
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch(`/api/meetings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      toast.success('Meeting schedule cancelled.')
      fetchMeetings()
    } catch {
      toast.error('Failed to cancel meeting schedule')
    }
  }

  const filtered = meetings.filter(m => {
    const matchSearch = (m.scholar || '').toLowerCase().includes(search.toLowerCase()) || (m.type || '').toLowerCase().includes(search.toLowerCase())
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
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            { label: 'Total Meetings', value: meetings.length, icon: '📅', color: 'purple' },
            { label: 'Upcoming', value: meetings.filter(m => m.status === 'Scheduled').length, icon: '⏰', color: 'orange' },
            { label: 'Completed', value: meetings.filter(m => m.status === 'Completed').length, icon: '✅', color: 'green' },
            { label: 'Viva Voce', value: meetings.filter(m => m.type === 'Viva Voce').length, icon: '🎓', color: 'blue' },
            { label: 'Synopsis Review', value: meetings.filter(m => m.type === 'Synopsis Review').length, icon: '📋', color: 'indigo' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '--' : s.value}</div>
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
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading scheduled slots...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No meetings found matching parameters</div>
            ) : (
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
                    <tr key={m.id || m._id}>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{m.type}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{m.scholar}</td>
                      <td>
                        <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{m.date}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.time}</div>
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{m.venue}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '200px' }}>{m.panel || '—'}</td>
                      <td>
                        <span className={`badge ${m.status === 'Completed' ? 'badge-success' : m.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn btn-secondary btn-sm" title="Edit" onClick={() => setEditingMeeting(m)}>✏️</button>
                          <button className="btn btn-ghost btn-sm" title="Delete" style={{ color: '#EF4444' }} onClick={() => handleDelete(m.id || m._id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
