import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '🏠', exact: true, section: 'OVERVIEW' },
  { to: '/admin/users', label: 'User Management', icon: '👥', section: 'MANAGEMENT' },
  { to: '/admin/research', label: 'Research', icon: '🔬', section: 'MANAGEMENT' },
  { to: '/admin/synopsis', label: 'Synopsis', icon: '📋', section: 'MANAGEMENT' },
  { to: '/admin/thesis', label: 'Thesis', icon: '📚', section: 'MANAGEMENT' },
  { to: '/admin/viva', label: 'Viva Voce', icon: '🎓', section: 'MANAGEMENT' },
  { to: '/admin/assign', label: 'Assign Scholar', icon: '🧑‍🎓', section: 'MANAGEMENT' },
  { to: '/admin/drc', label: 'Meetings', icon: '📅', section: 'MANAGEMENT' },
  { to: '/admin/reports', label: 'Reports', icon: '📊', section: 'ANALYTICS' },
  { to: '/admin/audit', label: 'Audit Log', icon: '🔍', section: 'ANALYTICS' },
  { to: '/admin/notifications', label: 'Notifications', icon: '🔔', badge: 3, section: 'SYSTEM' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️', section: 'SYSTEM' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  // Group nav items by section
  const sections = [...new Set(NAV_ITEMS.map(i => i.section))]

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">R</div>
          <div className="logo-text">
            <span className="logo-title">RMS Portal</span>
            <span className="logo-subtitle">Research Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => {
            const items = NAV_ITEMS.filter(i => i.section === section)
            return (
              <div key={section}>
                <p className="nav-section-label">{section}</p>
                {items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Admin'}</div>
              <div className="user-role">System Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '9px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(239,68,68,0.15)',
              color: '#FCA5A5',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.28)' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(239,68,68,0.15)' }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
