import { useState } from 'react'

const vivaData = [
  { id: 1, scholar: 'Rahul Sharma', thesis: 'AI in Healthcare Diagnostics', supervisor: 'Dr. Priya Kumar', dept: 'CS', date: '2024-08-10', time: '10:00 AM', venue: 'Seminar Hall A', panel: 'Dr. M. Reddy, Prof. R. Iyer', status: 'Scheduled' },
  { id: 2, scholar: 'Neha Patel', thesis: 'IoT in Smart Agriculture', supervisor: 'Dr. Rajan Mehta', dept: 'ECE', date: '2024-08-15', time: '11:30 AM', venue: 'Conference Room 2', panel: 'Dr. A. Sharma, Prof. K. Das', status: 'Scheduled' },
  { id: 3, scholar: 'Amit Kumar', thesis: 'Blockchain in Supply Chain', supervisor: 'Dr. Sunita Rao', dept: 'CS', date: '2024-07-20', time: '02:00 PM', venue: 'Seminar Hall B', panel: 'Dr. P. Singh, Prof. V. Kumar', status: 'Completed' },
  { id: 4, scholar: 'Sonal Joshi', thesis: 'Deep Learning for NLP', supervisor: 'Dr. Priya Kumar', dept: 'CS', date: '2024-09-05', time: '10:00 AM', venue: 'Online (Zoom)', panel: 'TBD', status: 'Pending' },
  { id: 5, scholar: 'Vikram Singh', thesis: 'Renewable Energy Systems', supervisor: 'Dr. Rajan Mehta', dept: 'Mech', date: '2024-07-12', time: '03:00 PM', venue: 'Seminar Hall A', panel: 'Dr. K. Roy, Prof. A. Nair', status: 'Completed' },
]

const STATUS_COLORS = { Scheduled: 'badge-info', Completed: 'badge-success', Pending: 'badge-warning', Cancelled: 'badge-danger' }

function ScheduleModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Schedule Viva Voce</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Scholar</label>
              <select className="form-control form-select">
                <option>Select Scholar</option>
                <option>Sonal Joshi</option>
                <option>Pooja Mehta</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Supervisor</label>
              <input className="form-control" placeholder="Auto-filled" defaultValue="Dr. Priya Kumar" readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="time" className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Venue</label>
              <input className="form-control" placeholder="Seminar Hall / Online" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Panel Members (comma separated)</label>
              <input className="form-control" placeholder="Dr. A, Dr. B, Prof. C" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Special Instructions</label>
              <textarea className="form-control" rows={2} placeholder="Any notes..." />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>📅 Schedule Viva</button>
        </div>
      </div>
    </div>
  )
}

export default function VivaVoce() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = vivaData.filter(v =>
    (v.scholar.toLowerCase().includes(search.toLowerCase()) || v.dept.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === 'All' || v.status === filterStatus)
  )

  return (
    <div className="animate-fade">
      {showModal && <ScheduleModal onClose={() => setShowModal(false)} />}
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
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Total Scheduled', value: vivaData.length, icon: '📅', color: 'purple' },
            { label: 'Upcoming', value: vivaData.filter(v => v.status === 'Scheduled').length, icon: '⏰', color: 'blue' },
            { label: 'Completed', value: vivaData.filter(v => v.status === 'Completed').length, icon: '✅', color: 'green' },
            { label: 'Pending Setup', value: vivaData.filter(v => v.status === 'Pending').length, icon: '⏳', color: 'orange' },
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

        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input className="form-control" placeholder="Search scholar or department..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control form-select" style={{ width: '160px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {['All', 'Scheduled', 'Completed', 'Pending', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
            <input type="date" className="form-control" style={{ width: '150px' }} />
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{filtered.length} viva(s)</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Scholar</th>
                  <th>Thesis Title</th>
                  <th>Supervisor</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((viva, i) => (
                  <tr key={viva.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{viva.scholar.charAt(0)}</div>
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
                    <td><span className={`badge ${STATUS_COLORS[viva.status]}`}>{viva.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm">✏️</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }}>🗑️</button>
                        {viva.status === 'Scheduled' && <button className="btn btn-success btn-sm">✓</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="pagination-info">Showing {filtered.length} of {vivaData.length} entries</span>
            <button className="page-btn active">1</button>
          </div>
        </div>
      </div>
    </div>
  )
}
