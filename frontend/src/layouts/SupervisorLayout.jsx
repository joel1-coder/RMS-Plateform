import PortalLayout from './PortalLayout'

const NAV_SECTIONS = [
  {
    label: 'MAIN',
    items: [
      { to: '/supervisor', label: 'Dashboard', icon: 'dashboard', exact: true },
      { to: '/supervisor/scholars', label: 'My Scholars', icon: 'users' },
    ],
  },
  {
    label: 'REVIEWS',
    items: [
      { to: '/supervisor/synopsis', label: 'Synopsis Review', icon: 'clipboard', badge: 3 },
      { to: '/supervisor/thesis', label: 'Thesis Review', icon: 'book', badge: 1 },
      { to: '/supervisor/publications', label: 'Publications', icon: 'pen', badge: 14 },
    ],
  },
  {
    label: 'DC MANAGEMENT',
    items: [
      { to: '/supervisor/dc-members', label: 'DC Members', icon: 'users' },
      { to: '/supervisor/schedule-dc-meeting', label: 'Schedule DC Meeting', icon: 'calendar' },
      { to: '/supervisor/dc-meetings', label: 'DC Meetings & Minutes', icon: 'file' },
    ],
  },
  {
    label: 'ACADEMIC',
    items: [
      { to: '/supervisor/synopsis-submission', label: 'Synopsis Submission', icon: 'clipboard' },
      { to: '/supervisor/co-supervisor', label: 'Add Co-Supervisor', icon: 'userCheck' },
      { to: '/supervisor/coursework-list', label: 'Coursework List', icon: 'book' },
      { to: '/supervisor/coursework-details', label: 'Coursework Details', icon: 'file' },
      { to: '/supervisor/thesis-submission', label: 'Thesis Submission', icon: 'book' },
      { to: '/supervisor/thesis-viva', label: 'Viva Voce', icon: 'clipboardCheck' },
    ],
  },
  {
    label: 'EXAMINATION',
    items: [
      { to: '/supervisor/examiner-panel', label: 'Examiner Panel', icon: 'microscope' },
      { to: '/supervisor/cancellation', label: 'Cancellation', icon: 'x' },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { to: '/supervisor/meetings', label: 'Meetings', icon: 'calendar' },
      { to: '/supervisor/progress', label: 'Progress Reports', icon: 'file' },
      { to: '/supervisor/notifications', label: 'Notifications', icon: 'bell', badge: 5 },
      { to: '/supervisor/profile', label: 'Profile', icon: 'user' },
    ],
  },
]

export default function SupervisorLayout() {
  return (
    <PortalLayout
      title="Supervisor Portal"
      subtitle="Academic Review"
      navSections={NAV_SECTIONS}
      userFallback="D"
      roleLabel="Senior Supervisor"
      notice={{ icon: 'clipboard', label: 'REVIEW QUEUE', value: '12 items pending', tone: 'danger' }}
    />
  )
}
