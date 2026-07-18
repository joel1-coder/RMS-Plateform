import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/drc', label: 'Dashboard', icon: '🏠', exact: true },
  { to: '/drc/synopsis', label: 'Synopsis Approval', icon: '📋', badge: 5 },
  { to: '/drc/meetings', label: 'Meeting Management', icon: '📅' },
  { to: '/drc/minutes', label: 'Meeting Minutes', icon: '📝' },
  { to: '/drc/reports', label: 'Reports & Analytics', icon: '📊' },
  { to: '/drc/notifications', label: 'Notifications', icon: '🔔', badge: 3 },
]

export default function DRCLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <aside className="sidebar" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #0F766E 100%)' }}>
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #0D9488, #0F766E)' }}>D</div>
          <div className="logo-text">
            <span className="logo-title">Research RMS</span>
            <span className="logo-subtitle">DRC ADMIN</span>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: '20px' }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(90deg, #0D9488, #0F766E)',
                boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
              } : {}}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge" style={{ background: item.label === 'Synopsis Approval' ? '#D97706' : '#EF4444' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #0D9488, #10B981)' }}>
              {user?.name?.charAt(0) || 'D'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Dr. Mohan Reddy'}</div>
              <div className="user-role">DRC Chairman</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', marginTop: '8px', padding: '9px',
            borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(239,68,68,0.15)', color: '#FCA5A5',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
