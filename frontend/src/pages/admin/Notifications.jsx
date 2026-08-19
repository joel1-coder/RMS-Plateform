import { apiFetch } from '../../utils/api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  info: '#3B82F6', 
  success: '#10B981', 
  danger: '#EF4444', 
  warning: '#F59E0B', 
  primary: '#6C63FF',
  allocation: '#8B5CF6'
}

export default function Notifications() {
  const [notifs, setNotifs] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setNotifs(data)
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifs.filter(n => !n.read).length

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      toast.success('All notifications marked as read')
      fetchNotifications()
    } catch {
      toast.error('Failed to update notifications status')
    }
  }

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch('/api/notifications/clear', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      toast.success('Notifications cleared')
      fetchNotifications()
    } catch {
      toast.error('Failed to clear notifications')
    }
  }

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
          <button className="btn btn-danger btn-sm" style={{ background: '#EF4444', borderColor: '#EF4444' }} onClick={handleClearAll}>✕ Clear all</button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
          {[
            { label: 'Total Alerts', value: notifs.length, icon: '🔔', color: 'purple' },
            { label: 'Unread Logs', value: unreadCount, icon: '📩', color: 'blue' },
            { label: 'Allocations', value: notifs.filter(n => n.type === 'allocation').length, icon: '🔗', color: 'green' },
            { label: 'General Alerts', value: notifs.filter(n => n.type === 'general' || n.type === 'info').length, icon: '📢', color: 'orange' },
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
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading alerts...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔕</div>
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id || notif._id}
                className={`notification-item${notif.read ? '' : ' unread'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 'var(--radius-md)',
                  background: `${TYPE_COLORS[notif.type || 'info'] || '#6C63FF'}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                }}>
                  {notif.type === 'allocation' ? '🔗' : '🔔'}
                </div>
                <div className="notification-body" style={{ flex: 1 }}>
                  <div className="notification-title" style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{notif.title}</div>
                  <div className="notification-text" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{notif.message}</div>
                  <div className="notification-time" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
                {!notif.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[notif.type || 'info'] || '#6C63FF', flexShrink: 0 }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
