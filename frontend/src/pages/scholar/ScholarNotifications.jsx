import { useState } from 'react'

const notifData = [
  { id: 1, icon: '✅', title: 'Chapter 3 Approved', msg: 'Your supervisor Dr. Priya Kumar has approved Chapter 3 – Research Methodology.', time: '10 min ago', read: false, type: 'success' },
  { id: 2, icon: '🔔', title: 'DRC Meeting Scheduled', msg: 'A DRC progress review meeting is scheduled for July 25, 2024 at 11:00 AM, Board Room 1.', time: '1 hr ago', read: false, type: 'info' },
  { id: 3, icon: '💬', title: 'Supervisor Feedback', msg: 'Dr. Kumar added comments on Chapter 4 draft. Please review and revise before Aug 5.', time: '3 hrs ago', read: false, type: 'warning' },
  { id: 4, icon: '📅', title: 'Viva Tentatively Scheduled', msg: 'Your viva voce has been tentatively scheduled for November 12, 2024. Details will follow.', time: '1 day ago', read: true, type: 'primary' },
  { id: 5, icon: '📰', title: 'Paper Status Update', msg: 'Your paper "Federated Learning Approaches" is currently under review at Springer LNCS.', time: '2 days ago', read: true, type: 'info' },
  { id: 6, icon: '⏰', title: 'Deadline Reminder', msg: 'Progress report for Jan–Jun 2024 was submitted. Awaiting supervisor sign-off.', time: '3 days ago', read: true, type: 'warning' },
  { id: 7, icon: '🎓', title: 'Registration Renewal', msg: 'Your PhD registration is due for annual renewal. Submit Form R-12 by July 31, 2024.', time: '5 days ago', read: true, type: 'danger' },
  { id: 8, icon: '📚', title: 'Library Book Due', msg: 'Library book "Deep Learning Goodfellow" is due for return on July 25, 2024.', time: '1 week ago', read: true, type: 'info' },
]

const TYPE_COLORS = { success: '#10B981', info: '#3B82F6', warning: '#F59E0B', danger: '#EF4444', primary: '#6C63FF' }

export default function ScholarNotifications() {
  const [notifs, setNotifs] = useState(notifData)
  const [filter, setFilter] = useState('all')

  const unread = notifs.filter(n => !n.read).length
  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })))
  const markRead = id => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  const del = id => setNotifs(p => p.filter(n => n.id !== id))

  const filtered = notifs.filter(n => filter === 'all' ? true : filter === 'unread' ? !n.read : n.read)

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Notifications</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {unread} unread notification{unread !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={markAll}>✓ Mark all read</button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
          {[
            { label: 'Total', value: notifs.length, icon: '🔔', color: 'purple' },
            { label: 'Unread', value: unread, icon: '📩', color: 'blue' },
            { label: 'Alerts', value: notifs.filter(n => n.type === 'danger').length, icon: '🚨', color: 'red' },
            { label: 'Reminders', value: notifs.filter(n => n.type === 'warning').length, icon: '⏰', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '4px', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            {[{ id: 'all', label: `All (${notifs.length})` }, { id: 'unread', label: `Unread (${unread})` }, { id: 'read', label: 'Read' }].map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: '7px 16px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: filter === t.id ? '#D1FAE5' : 'transparent',
                color: filter === t.id ? '#059669' : 'var(--text-secondary)',
                fontWeight: filter === t.id ? 700 : 500, fontSize: '13px',
              }}>{t.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🔕</div><h3>No notifications</h3><p>You're all caught up!</p></div>
          ) : (
            filtered.map(n => (
              <div key={n.id} className={`notification-item${n.read ? '' : ' unread'}`} onClick={() => markRead(n.id)}
                style={{ borderLeft: !n.read ? `3px solid ${TYPE_COLORS[n.type]}` : '3px solid transparent' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: `${TYPE_COLORS[n.type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>{n.icon}</div>
                <div className="notification-body">
                  <div className="notification-title">{n.title}</div>
                  <div className="notification-text">{n.msg}</div>
                  <div className="notification-time">{n.time}</div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[n.type], flexShrink: 0, marginTop: 6 }} />}
                <button onClick={e => { e.stopPropagation(); del(n.id) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '50%' }}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
