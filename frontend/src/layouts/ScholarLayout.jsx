import PortalLayout from './PortalLayout'

const NAV_ITEMS = [
  { to: '/scholar', label: 'Dashboard', icon: 'dashboard', exact: true, section: 'OVERVIEW' },
  { to: '/scholar/profile', label: 'My Profile', icon: 'user', section: 'MY ACCOUNT' },
  { to: '/scholar/research', label: 'My Research', icon: 'microscope', section: 'MY ACCOUNT' },
  { to: '/scholar/synopsis', label: 'Synopsis', icon: 'clipboard', section: 'SUBMISSIONS' },
  { to: '/scholar/thesis', label: 'Thesis', icon: 'book', section: 'SUBMISSIONS' },
  { to: '/scholar/documents', label: 'Documents', icon: 'file', section: 'SUBMISSIONS' },
  { to: '/scholar/viva', label: 'Viva Voce', icon: 'clipboardCheck', section: 'EXAMINATIONS' },
  { to: '/scholar/progress', label: 'Progress Report', icon: 'file', section: 'EXAMINATIONS' },
  { to: '/scholar/publications', label: 'Publications', icon: 'pen', section: 'ACADEMIC' },
  { to: '/scholar/schedule', label: 'My Schedule', icon: 'calendar', section: 'ACADEMIC' },
  { to: '/scholar/notifications', label: 'Notifications', icon: 'bell', badge: 5, section: 'SYSTEM' },
]

export default function ScholarLayout() {
  const sections = [...new Set(NAV_ITEMS.map(i => i.section))]
  const navSections = sections.map(label => ({ label, items: NAV_ITEMS.filter(i => i.section === label) }))

  return (
    <PortalLayout
      title="Scholar Portal"
      subtitle="Research Progress"
      navSections={navSections}
      userFallback="S"
      roleLabel="PhD Scholar"
      notice={{ icon: 'clipboardCheck', label: 'PHD PROGRESS', value: '68 percent thesis stage', tone: 'success' }}
    />
  )
}
