import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/scholar', label: 'Dashboard', icon: '🏠', exact: true, section: 'OVERVIEW' },
  { to: '/scholar/profile', label: 'My Profile', icon: '👤', section: 'MY ACCOUNT' },
  { to: '/scholar/research', label: 'My Research', icon: '🔬', section: 'MY ACCOUNT' },
  { to: '/scholar/synopsis', label: 'Synopsis', icon: '📋', section: 'SUBMISSIONS' },
  { to: '/scholar/thesis', label: 'Thesis', icon: '📚', section: 'SUBMISSIONS' },
  { to: '/scholar/documents', label: 'Documents', icon: '📁', section: 'SUBMISSIONS' },
  { to: '/scholar/viva', label: 'Viva Voce', icon: '🎓', section: 'EXAMINATIONS' },
  { to: '/scholar/progress', label: 'Progress Report', icon: '📈', section: 'EXAMINATIONS' },
  { to: '/scholar/publications', label: 'Publications', icon: '📰', section: 'ACADEMIC' },
  { to: '/scholar/schedule', label: 'My Schedule', icon: '📅', section: 'ACADEMIC' },
  { to: '/scholar/notifications', label: 'Notifications', icon: '🔔', badge: 5, section: 'SYSTEM' },
]

export default function ScholarLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const sections = [...new Set(NAV_ITEMS.map(i => i.section))]

  // Compute overall PhD progress
  const phaseProgress = 68

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)' }}>
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>S</div>
          <div className="logo-text">
            <span className="logo-title">Scholar Portal</span>
            <span className="logo-subtitle">PhD Research Platform</span>
          </div>
        </div>

        {/* Progress Overview in Sidebar */}
        <div style={{ padding: '12px 16px', margin: '0 12px 8px', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>PhD Progress</span>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>{phaseProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${phaseProgress}%`, background: 'linear-gradient(90deg, #10B981, #059669)' }} />
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Thesis Writing Stage</div>
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
                    style={({ isActive }) => isActive ? { background: 'linear-gradient(90deg, #10B981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.35)' } : {}}
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
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Scholar'}</div>
              <div className="user-role">{user?.department || 'PhD Scholar'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', marginTop: '8px', padding: '9px',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(239,68,68,0.15)', color: '#FCA5A5',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
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
