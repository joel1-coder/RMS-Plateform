import { useState, useEffect, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'

const STATUS_COLORS = { Scheduled: 'badge-info', Completed: 'badge-success', Pending: 'badge-warning', Cancelled: 'badge-danger' }

function ScheduleModal({ onClose, onSave, scholars, editData = null }) {
  const emptyForm = {
    scholar: '',
    scholarId: '',
    thesis: '',
    supervisor: 'Auto-filled',
    supervisorId: '',
    dept: 'CS',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00',
    venue: '',
    panel: '',
    status: 'Scheduled',
    instructions: ''
  }

  const [form, setForm] = useState(editData ? { ...editData } : emptyForm)

  const handleScholarChange = (e) => {
    const sName = e.target.value
    const scholar = scholars.find(s => s.name === sName)
    if (scholar) {
      setForm({
        ...form,
        scholar: scholar.name,
        scholarId: scholar.id || scholar._id,
        supervisor: scholar.assignedSupervisor || 'No Supervisor Assigned',
        supervisorId: scholar.assignedSupervisorId || '',
        dept: scholar.dept || 'CS'
      })
    } else {
      setForm({
        ...form,
        scholar: '',
        scholarId: '',
        supervisor: 'Auto-filled',
        supervisorId: '',
        dept: 'CS'
      })
    }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.scholar || !form.thesis || !form.date || !form.time || !form.venue) {
      toast.error('Scholar, Thesis Title, Date, Time and Venue are required')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{editData ? 'Edit Viva Voce details' : 'Schedule Viva Voce'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Scholar *</label>
                {editData ? (
                  <input className="form-control" value={form.scholar} readOnly />
                ) : (
                  <select className="form-control form-select" name="scholar" value={form.scholar} onChange={handleScholarChange} required>
                    <option value="">Select Scholar</option>
                    {scholars.map(s => <option key={s.id || s._id} value={s.name}>{s.name} ({s.dept})</option>)}
                  </select>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Supervisor</label>
                <input className="form-control" name="supervisor" placeholder="Auto-filled" value={form.supervisor} readOnly />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Thesis Title *</label>
                <input className="form-control" name="thesis" placeholder="e.g. AI in Healthcare Diagnostics" value={form.thesis} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <input type="time" name="time" className="form-control" value={form.time} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Venue *</label>
                <input className="form-control" name="venue" placeholder="Seminar Hall / Online" value={form.venue} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Panel Members (comma separated)</label>
                <input className="form-control" name="panel" placeholder="Dr. A, Dr. B, Prof. C" value={form.panel} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Special Instructions</label>
                <textarea className="form-control" name="instructions" rows={2} placeholder="Any notes..." value={form.instructions} onChange={handleChange} />
              </div>
              {editData && (
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Status</label>
                  <select className="form-control form-select" name="status" value={form.status} onChange={handleChange}>
                    {['Scheduled', 'Completed', 'Pending', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">📅 {editData ? 'Save Changes' : 'Schedule Viva'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VivaVoce() {
  const [vivas, setVivas] = useState([])
  const [scholars, setScholars] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingViva, setEditingViva] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [loading, setLoading] = useState(true)

  const vivaAbortRef = useRef(null)
  const scholarAbortRef = useRef(null)

  const fetchVivas = useCallback(async (status) => {
    if (vivaAbortRef.current) vivaAbortRef.current.abort()
    vivaAbortRef.current = new AbortController()
    try {
      const token = localStorage.getItem('rms_token')
      const statusParam = status === 'All' ? '' : status
      const response = await fetch(`/api/viva-voce?status=${statusParam}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: vivaAbortRef.current.signal
      })
      if (!response.ok) throw new Error('Failed to fetch scheduled viva voce exams')
      const data = await response.json()
      setVivas(data)
    } catch (err) {
      if (err.name === 'AbortError') return
      toast.error('Failed to load viva voce list')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchScholars = useCallback(async () => {
    if (scholarAbortRef.current) scholarAbortRef.current.abort()
    scholarAbortRef.current = new AbortController()
    try {
      const token = localStorage.getItem('rms_token')
      const response = await fetch('/api/users?role=scholar', {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: scholarAbortRef.current.signal
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setScholars(data)
    } catch (err) {
      if (err.name === 'AbortError') return
      console.error('Failed to load scholar selection dropdown data')
    }
  }, [])

  // Scholars only load once on mount
  useEffect(() => {
    fetchScholars()
  }, [fetchScholars])

  // Vivas reload when filter changes
  useEffect(() => {
    fetchVivas(filterStatus)
  }, [filterStatus, fetchVivas])

  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem('rms_token')
      if (editingViva) {
        // Edit mode
        const response = await fetch(`/api/viva-voce/${editingViva.id || editingViva._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })
        if (!response.ok) throw new Error('Failed to update viva voce scheduling details')
        toast.success('Viva details updated!')
        setEditingViva(null)
      } else {
        // Add mode
        const response = await fetch('/api/viva-voce', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Failed to schedule viva voce')
        }
        toast.success('Viva scheduled successfully!')
      }
      fetchVivas(filterStatus)
    } catch (err) {
      toast.error(err.message || 'Error occurred during save operation')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this scheduled viva voce examination?')) {
      try {
        const token = localStorage.getItem('rms_token')
        const response = await fetch(`/api/viva-voce/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('Failed to delete scheduled viva voce')
        toast.success('Viva schedule deleted successfully')
        fetchVivas(filterStatus)
      } catch (err) {
        toast.error('Failed to delete scheduled viva')
      }
    }
  }

  const handleToggleStatus = async (viva, newStatus) => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await fetch(`/api/viva-voce/${viva.id || viva._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error()
      toast.success(`Viva status updated to ${newStatus}`)
      fetchVivas(filterStatus)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const filtered = vivas.filter(v =>
    (v.scholar?.toLowerCase().includes(search.toLowerCase()) || v.dept?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="animate-fade">
      {(showModal || editingViva) && (
        <ScheduleModal
          editData={editingViva}
          scholars={scholars}
          onClose={() => { setShowModal(false); setEditingViva(null) }}
          onSave={handleSave}
        />
      )}
      <div className="topbar">
        <div>
          <div className="topbar-title">Viva Voce Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Schedule and track viva voce examinations</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>📅 Schedule Viva</button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Scheduled', value: vivas.length, icon: '📅', color: 'purple' },
            { label: 'Upcoming', value: vivas.filter(v => v.status === 'Scheduled').length, icon: '⏰', color: 'blue' },
            { label: 'Completed', value: vivas.filter(v => v.status === 'Completed').length, icon: '✅', color: 'green' },
            { label: 'Pending Setup', value: vivas.filter(v => v.status === 'Pending').length, icon: '⏳', color: 'orange' },
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

        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input className="form-control" placeholder="Search scholar or department..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control form-select" style={{ width: '160px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {['All', 'Scheduled', 'Completed', 'Pending', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} viva(s)</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading viva list...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No scheduled viva voce found</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Scholar</th>
                    <th>Thesis Title</th>
                    <th>Supervisor</th>
                    <th>Date &amp; Time</th>
                    <th>Venue</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((viva, i) => (
                    <tr key={viva.id || viva._id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{viva.scholar?.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{viva.scholar}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{viva.dept}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ maxWidth: '220px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>{viva.thesis}</td>
                      <td style={{ fontSize: '12.5px' }}>{viva.supervisor}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{viva.date}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{viva.time}</div>
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{viva.venue}</td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[viva.status] || 'badge-gray'}`}>
                          {viva.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {viva.status === 'Scheduled' && (
                            <button className="btn btn-ghost btn-sm" style={{ color: '#10B981' }} onClick={() => handleToggleStatus(viva, 'Completed')} title="Mark Completed">✓</button>
                          )}
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingViva(viva)} title="Edit">✏️</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }} onClick={() => handleDelete(viva.id || viva._id)} title="Delete">🗑️</button>
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
