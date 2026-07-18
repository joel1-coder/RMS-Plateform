import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const NAV_SECTIONS = [
  {
    label: 'MAIN',
    items: [
      { to: '/supervisor', label: 'Dashboard', icon: '🏠', exact: true },
      { to: '/supervisor/scholars', label: 'My Scholars', icon: '👥' },
    ]
  },
  {
    label: 'REVIEWS',
    items: [
      { to: '/supervisor/synopsis', label: 'Synopsis', icon: '📋', badge: 3 },
      { to: '/supervisor/thesis', label: 'Thesis', icon: '📚', badge: 1 },
      { to: '/supervisor/publications', label: 'Publications', icon: '📰', badge: 14 },
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { to: '/supervisor/meetings', label: 'Meetings', icon: '📅' },
      { to: '/supervisor/progress', label: 'Progress Reports', icon: '📈' },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/supervisor/notifications', label: 'Notifications', icon: '🔔', badge: 5 },
      { to: '/supervisor/profile', label: 'Profile', icon: '👤' },
    ]
  }
]

export default function SupervisorLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar" style={{ background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)' }}>
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #6C63FF, #4F46E5)' }}>S</div>
          <div className="logo-text">
            <span className="logo-title">Supervisor Portal</span>
            <span className="logo-subtitle">RESEARCHRMS</span>
          </div>
        </div>

        {/* Review Queue Badge */}
        <div style={{
          margin: '0 12px 12px',
          padding: '10px 14px',
          background: 'rgba(239,68,68,0.12)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '16px' }}>🔴</span>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>REVIEW QUEUE</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FCA5A5' }}>12 items pending</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <p className="nav-section-label">{section.label}</p>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  style={({ isActive }) => isActive ? {
                    background: 'linear-gradient(90deg, #6C63FF, #4F46E5)',
                    boxShadow: '0 4px 12px rgba(108,99,255,0.4)',
                  } : {}}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge" style={{ background: '#EF4444' }}>{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #6C63FF, #EC4899)' }}>
              {user?.name?.charAt(0) || 'D'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Dr. Sarah Jenkins'}</div>
              <div className="user-role">Senior Supervisor</div>
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
