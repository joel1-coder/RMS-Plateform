import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import toast from 'react-hot-toast'

const TYPE_COLORS = { success: '#1E7D45', info: '#174EA6', warning: '#C89B1E', danger: '#B4232A', primary: '#174EA6' }

export default function ScholarNotifications() {
  const [notifs, setNotifs] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchNotifs = async () => {
    try {
      const token = sessionStorage.getItem('rms_token')
      const res = await apiFetch('/api/notifications', { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setNotifs(data)
      }
    } catch (err) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  const unread = notifs.filter(n => !n.read).length

  const markAllRead = async () => {
    try {
      const token = sessionStorage.getItem('rms_token')
      await apiFetch('/api/notifications/read', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } })
      fetchNotifs()
      toast.success('All marked as read')
    } catch (err) {
      toast.error('Failed to update')
    }
  }

  const markRead = async (id) => {
    // Optimistic update
    setNotifs(p => p.map(n => n._id === id || n.id === id ? { ...n, read: true } : n))
  }

  const handleClear = async () => {
    try {
      const token = sessionStorage.getItem('rms_token')
      await apiFetch('/api/notifications/clear', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      fetchNotifs()
      toast.success('Cleared all notifications')
    } catch (err) {
      toast.error('Failed to clear notifications')
    }
  }

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
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}> Mark all read</button>
          <button className="btn btn-danger btn-sm" onClick={handleClear}> Clear all</button>
        </div>
      </div>

      <div className="page-body">
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
          {[
            { label: 'Total', value: notifs.length, icon: '', color: 'blue' },
            { label: 'Unread', value: unread, icon: '', color: 'blue' },
            { label: 'Alerts', value: notifs.filter(n => n.type === 'danger' || n.type === 'allocation').length, icon: '', color: 'red' },
            { label: 'Reminders', value: notifs.filter(n => n.type === 'warning').length, icon: '', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info"><div className="stat-value">{loading ? '--' : s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '4px', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            {[{ id: 'all', label: `All (${notifs.length})` }, { id: 'unread', label: `Unread (${unread})` }, { id: 'read', label: 'Read' }].map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: '7px 16px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: filter === t.id ? '#E7F4EC' : 'transparent',
                color: filter === t.id ? '#166A3A' : 'var(--text-secondary)',
                fontWeight: filter === t.id ? 700 : 500, fontSize: '13px',
              }}>{t.label}</button>
            ))}
          </div>

          {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading alerts...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon"></div><h3>No notifications</h3><p>You're all caught up!</p></div>
          ) : (
            filtered.map(n => {
              const id = n._id || n.id;
              return (
              <div key={id} className={`notification-item${n.read ? '' : ' unread'}`} onClick={() => markRead(id)}
                style={{ borderLeft: !n.read ? `3px solid ${TYPE_COLORS[n.type] || '#174EA6'}` : '3px solid transparent' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: `${TYPE_COLORS[n.type] || '#174EA6'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>{n.icon}</div>
                <div className="notification-body">
                  <div className="notification-title">{n.title}</div>
                  <div className="notification-text">{n.message}</div>
                  <div className="notification-time">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[n.type] || '#174EA6', flexShrink: 0, marginTop: 6 }} />}
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  )
}
