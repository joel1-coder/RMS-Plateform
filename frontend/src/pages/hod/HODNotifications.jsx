import { useState } from 'react'

const initialNotifs = [
  { id: 1, icon: '🔗', title: 'New Allocation Needed', msg: 'Sarah Jenkins (REG-2023-014) is pending supervisor allocation.', time: '10 min ago', read: false, type: 'warning' },
  { id: 2, icon: '📄', title: 'Thesis Submission Draft', msg: 'Arjun Mehta uploaded Phase II thesis draft for Dr. Alan Turing\'s review.', time: '1 hr ago', read: false, type: 'info' },
  { id: 3, icon: '🏆', title: 'Grant Opportunity', msg: 'Departmental Quantum lab has been approved for a $45k research grant.', time: '3 hrs ago', read: false, type: 'success' },
  { id: 4, icon: '⚠️', title: 'DRC Meeting Delayed', msg: 'HOD/DRC joint review has been postponed to next Wednesday.', time: '1 day ago', read: true, type: 'danger' },
  { id: 5, icon: '📊', title: 'Bi-Annual Progress Review', msg: 'Vanguard compliance team requests annual progress reports for batch 2021.', time: '2 days ago', read: true, type: 'primary' },
]

const TYPE_COLORS = { success: '#10B981', info: '#3B82F6', warning: '#F59E0B', danger: '#EF4444', primary: '#8B5CF6' }

export default function HODNotifications() {
  const [notifs, setNotifs] = useState(initialNotifs)
  const [filter, setFilter] = useState('all')

  const unread = notifs.filter(n => !n.read).length
  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })))
  const markRead = id => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  const del = id => setNotifs(p => p.filter(n => n.id !== id))

  const filtered = notifs.filter(n => filter === 'all' ? true : filter === 'unread' ? !n.read : n.read)

  return (
    <div className="animate-fade">
      {/* Topbar */}
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
        <div className="card">
          <div style={{ display: 'flex', gap: '4px', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            {[{ id: 'all', label: `All (${notifs.length})` }, { id: 'unread', label: `Unread (${unread})` }, { id: 'read', label: 'Read' }].map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: '7px 16px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: filter === t.id ? '#DBEAFE' : 'transparent',
                color: filter === t.id ? '#1D4ED8' : 'var(--text-secondary)',
                fontWeight: filter === t.id ? 700 : 500, fontSize: '13px',
              }}>{t.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🔕</div><h3>No notifications</h3><p>No messages to display.</p></div>
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
