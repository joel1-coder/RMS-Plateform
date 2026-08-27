import { useState } from 'react'

const initialNotifs = [
  { id: 1, icon: '', title: 'Synopsis Waiting DRC Review', msg: 'Aravind Sharma submitted his research synopsis for CS Board Approval.', time: '2 hours ago', read: false, type: 'warning' },
  { id: 2, icon: '', title: 'DRC Evaluation Panel Confirmed', msg: 'The evaluation committee for Arjun Mehta has been scheduled for Oct 25.', time: '5 hours ago', read: false, type: 'success' },
  { id: 3, icon: '', title: 'Meeting Minutes Draft Created', msg: 'A draft of the minutes of the meeting for the Biotechnology Board has been recorded.', time: 'Yesterday', read: true, type: 'info' },
]

const TYPE_COLORS = { success: '#1E7D45', info: '#174EA6', warning: '#C89B1E', danger: '#B4232A', primary: '#174EA6' }

export default function DRCNotifications() {
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
          <div className="topbar-title">DRC Notifications Logs</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {unread} unread warning logs
          </span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={markAll}> Mark all read</button>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div style={{ display: 'flex', gap: '4px', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            {[{ id: 'all', label: `All (${notifs.length})` }, { id: 'unread', label: `Unread (${unread})` }, { id: 'read', label: 'Read' }].map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: '7px 16px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: filter === t.id ? '#E8EEF8' : 'transparent',
                color: filter === t.id ? '#0A2A66' : 'var(--text-secondary)',
                fontWeight: filter === t.id ? 700 : 500, fontSize: '13px',
              }}>{t.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon"></div><h3>No notifications</h3><p>No messages to display.</p></div>
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
                <button onClick={e => { e.stopPropagation(); del(n.id) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '50%' }}></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
