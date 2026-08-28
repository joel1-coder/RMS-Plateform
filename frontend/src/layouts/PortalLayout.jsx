import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import AppIcon from '../components/AppIcon'
import { InstitutionBrand } from '../components/InstitutionBrand'

export default function PortalLayout({
  title,
  subtitle,
  navSections,
  userFallback,
  roleLabel,
  notice,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="app-layout">
      {/* Mobile Top Navigation Bar */}
      <div className="mobile-header">
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <AppIcon name="menu" size={22} />
        </button>
        <div className="mobile-brand">
          <InstitutionBrand title={title} subtitle={subtitle} size="sm" />
        </div>
        <div className="avatar avatar-sm">
          {user?.name?.charAt(0) || userFallback}
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <InstitutionBrand title={title} subtitle={subtitle} size="sm" />
          <button className="mobile-close-btn" onClick={closeMobile}>✕</button>
        </div>

        {notice && (
          <div className={`sidebar-notice sidebar-notice-${notice.tone || 'info'}`}>
            <AppIcon name={notice.icon || 'bell'} size={17} />
            <div>
              <div className="sidebar-notice-label">{notice.label}</div>
              <div className="sidebar-notice-value">{notice.value}</div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav" aria-label={`${title} navigation`}>
          {navSections.map(section => (
            <div key={section.label}>
              <p className="nav-section-label">{section.label}</p>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={closeMobile}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  <span className="nav-icon"><AppIcon name={item.icon} size={18} /></span>
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">
              {user?.name?.charAt(0) || userFallback}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || roleLabel}</div>
              <div className="user-role">{user?.department || user?.dept || roleLabel}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout">
            <AppIcon name="logout" size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
