import { useState } from 'react'

const notifData = [
  { id: 1, title: 'New Synopsis Submitted', msg: 'Rahul Sharma submitted synopsis for review (Topic: AI in Healthcare)', time: '5 min ago', read: false, type: 'info', icon: '📋' },
  { id: 2, title: 'Viva Voce Scheduled', msg: 'Viva for Neha Patel has been scheduled on Aug 10, 2024 at 10:00 AM', time: '20 min ago', read: false, type: 'success', icon: '🎓' },
  { id: 3, title: 'Thesis Submitted', msg: 'Amit Kumar submitted final thesis. Awaiting DRC review.', time: '1 hr ago', read: false, type: 'primary', icon: '📚' },
  { id: 4, title: 'Login Alert', msg: 'Suspicious login attempt detected from IP 10.0.0.55 for Neha Patel.', time: '3 hrs ago', read: true, type: 'danger', icon: '🚨' },
  { id: 5, title: 'DRC Meeting Reminder', msg: 'DRC review meeting for CS Dept scheduled on July 25, 2024', time: '5 hrs ago', read: true, type: 'warning', icon: '📅' },
  { id: 6, title: 'Report Ready', msg: 'Monthly progress report for July 2024 has been generated.', time: '1 day ago', read: true, type: 'success', icon: '📊' },
  { id: 7, title: 'New User Registration', msg: 'New scholar application received from Sonal Joshi (Electronics dept)', time: '1 day ago', read: true, type: 'info', icon: '👤' },
  { id: 8, title: 'Deadline Approaching', msg: 'Synopsis submission deadline is in 14 days (Sep 30, 2024)', time: '2 days ago', read: true, type: 'warning', icon: '⏰' },
]

const TYPE_COLORS = {
  info: '#3B82F6', success: '#10B981', danger: '#EF4444', warning: '#F59E0B', primary: '#6C63FF',
}

export default function Notifications() {
  const [notifs, setNotifs] = useState(notifData)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifs.filter(n => !n.read).length

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const deleteNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id))

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Notifications</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}>✓ Mark all as read</button>
          <button className="btn btn-primary btn-sm">🔔 Settings</button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
          {[
            { label: 'Total', value: notifs.length, icon: '🔔', color: 'purple' },
            { label: 'Unread', value: unreadCount, icon: '📩', color: 'blue' },
            { label: 'Alerts', value: notifs.filter(n => n.type === 'danger').length, icon: '🚨', color: 'red' },
            { label: 'Reminders', value: notifs.filter(n => n.type === 'warning').length, icon: '⏰', color: 'orange' },
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
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            {[
              { id: 'all', label: `All (${notifs.length})` },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'read', label: 'Read' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: filter === tab.id ? 'var(--primary-light)' : 'transparent',
                  color: filter === tab.id ? 'var(--primary-dark)' : 'var(--text-secondary)',
                  fontWeight: filter === tab.id ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔕</div>
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                className={`notification-item${notif.read ? '' : ' unread'}`}
                onClick={() => markRead(notif.id)}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 'var(--radius-md)',
                  background: `${TYPE_COLORS[notif.type]}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                }}>
                  {notif.icon}
                </div>
                <div className="notification-body">
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-text">{notif.msg}</div>
                  <div className="notification-time">{notif.time}</div>
                </div>
                {!notif.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[notif.type], flexShrink: 0, marginTop: 6 }} />
                )}
                <button
                  onClick={e => { e.stopPropagation(); deleteNotif(notif.id) }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', padding: '4px', borderRadius: '50%' }}
                >✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
