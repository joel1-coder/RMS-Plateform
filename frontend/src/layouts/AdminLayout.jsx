import PortalLayout from './PortalLayout'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true, section: 'OVERVIEW' },
  { to: '/admin/users', label: 'User Management', icon: 'users', section: 'MANAGEMENT' },
  { to: '/admin/accepting-registration', label: 'Accepting Registration', icon: 'download', section: 'MANAGEMENT' },
  { to: '/admin/scholar-management', label: 'Scholar Management', icon: 'graduation', section: 'MANAGEMENT' },
  { to: '/admin/research', label: 'Research', icon: 'microscope', section: 'MANAGEMENT' },
  { to: '/admin/viva', label: 'Viva Voce', icon: 'clipboardCheck', section: 'MANAGEMENT' },
  { to: '/admin/assign', label: 'Assign Scholar', icon: 'userCheck', section: 'MANAGEMENT' },
  { to: '/admin/drc', label: 'Meetings', icon: 'calendar', section: 'MANAGEMENT' },
  { to: '/admin/reports', label: 'Reports', icon: 'file', section: 'ANALYTICS' },
  { to: '/admin/audit', label: 'Audit Log', icon: 'audit', section: 'ANALYTICS' },
  { to: '/admin/notifications', label: 'Notifications', icon: 'bell', badge: 3, section: 'SYSTEM' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings', section: 'SYSTEM' },
]

export default function AdminLayout() {
  const sections = [...new Set(NAV_ITEMS.map(i => i.section))]
  const navSections = sections.map(label => ({ label, items: NAV_ITEMS.filter(i => i.section === label) }))

  return (
    <PortalLayout
      title="RMS Portal"
      subtitle="Academic Administration"
      navSections={navSections}
      userFallback="A"
      roleLabel="System Administrator"
    />
  )
}
