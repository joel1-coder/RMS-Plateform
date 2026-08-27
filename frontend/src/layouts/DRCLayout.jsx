import PortalLayout from './PortalLayout'

const NAV = [
  { to: '/drc', label: 'Dashboard', icon: 'dashboard', exact: true },
  { to: '/drc/scholars', label: 'View Scholars', icon: 'graduation' },
  { to: '/drc/synopsis', label: 'Synopsis Approval', icon: 'clipboardCheck' },
  { to: '/drc/committee', label: 'Committee Management', icon: 'users' },
  { to: '/drc/meetings', label: 'Meeting Management', icon: 'calendar' },
  { to: '/drc/minutes', label: 'Meeting Minutes', icon: 'file' },
  { to: '/drc/reports', label: 'Reports', icon: 'file' },
  { to: '/drc/notifications', label: 'Notifications', icon: 'bell', badge: 3 },
]

export default function DRCLayout() {
  return (
    <PortalLayout
      title="DRC Portal"
      subtitle="Research Committee"
      navSections={[{ label: 'COMMITTEE', items: NAV }]}
      userFallback="D"
      roleLabel="DRC Chairman"
    />
  )
}
