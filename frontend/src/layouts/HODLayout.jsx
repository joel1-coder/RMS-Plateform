import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/hod', label: 'Dashboard', icon: '🏠', exact: true },
  { to: '/hod/scholars', label: 'Department Scholars', icon: '🎓' },
  { to: '/hod/supervisors', label: 'Supervisors', icon: '👨‍🏫' },
  { to: '/hod/allocations', label: 'Allocations', icon: '🔗', badge: 10 },
  { to: '/hod/reports', label: 'Reports', icon: '📊' },
  { to: '/hod/notifications', label: 'Notifications', icon: '🔔', badge: 4 },
]

export default function HODLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <aside className="sidebar" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E3A5F 100%)' }}>
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}>H</div>
          <div className="logo-text">
            <span className="logo-title">Research RMS</span>
            <span className="logo-subtitle">HOD DASHBOARD</span>
          </div>
        </div>

        {/* Admin Portal quick link */}
        <div style={{
          margin: '0 12px 12px',
          padding: '9px 12px',
          background: 'rgba(59,130,246,0.12)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(59,130,246,0.25)',
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
        }}>
          <span style={{ fontSize: '12px', color: '#93C5FD', fontWeight: 700 }}>🔗 Admin Portal</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
                boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
              } : {}}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge" style={{ background: item.label === 'Allocations' ? '#F59E0B' : '#EF4444' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
              {user?.name?.charAt(0) || 'H'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Dr. Helena Vance'}</div>
              <div className="user-role">Head of Department</div>
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
