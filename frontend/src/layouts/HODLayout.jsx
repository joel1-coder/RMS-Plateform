import PortalLayout from './PortalLayout'

const NAV = [
  { to: '/hod', label: 'Dashboard', icon: 'dashboard', exact: true },
  { to: '/hod/scholars', label: 'Department Scholars', icon: 'graduation' },
  { to: '/hod/supervisors', label: 'Supervisors', icon: 'users' },
  { to: '/hod/allocations', label: 'Allocations', icon: 'link', badge: 10 },
  { to: '/hod/reports', label: 'Reports', icon: 'file' },
  { to: '/hod/notifications', label: 'Notifications', icon: 'bell', badge: 4 },
]

export default function HODLayout() {
  return (
    <PortalLayout
      title="HOD Portal"
      subtitle="Department Management"
      navSections={[{ label: 'DEPARTMENT', items: NAV }]}
      userFallback="H"
      roleLabel="Head of Department"
      notice={{ icon: 'admin', label: 'ADMIN PORTAL', value: 'Department oversight active', tone: 'info' }}
    />
  )
}
