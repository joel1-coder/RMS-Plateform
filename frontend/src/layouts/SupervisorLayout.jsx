import { useState, useEffect } from 'react'
import PortalLayout from './PortalLayout'
import { apiFetch } from '../utils/api'

export default function SupervisorLayout() {
  const [pendingSynopsis, setPendingSynopsis] = useState(0)
  const [pendingThesis, setPendingThesis] = useState(0)

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = sessionStorage.getItem('rms_token')
        const res = await apiFetch('/api/submissions', { headers: { 'Authorization': `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const syn = data.filter(s => s.type === 'synopsis' && s.status === 'Pending Supervisor Approval').length
          const the = data.filter(s => s.type === 'thesis' && s.status === 'Pending Supervisor Approval').length
          setPendingSynopsis(syn)
          setPendingThesis(the)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchPending()
  }, [])

  const NAV_SECTIONS = [
    {
      label: 'MAIN',
      items: [
        { to: '/supervisor', label: 'Dashboard', icon: 'dashboard', exact: true },
        { to: '/supervisor/scholars', label: 'My Scholars', icon: 'users' },
        { to: '/supervisor/users', label: 'User Management', icon: 'admin' },
      ],
    },
    {
      label: 'REVIEWS',
      items: [
        { to: '/supervisor/synopsis', label: 'Synopsis Review', icon: 'clipboard', badge: pendingSynopsis > 0 ? pendingSynopsis : null },
        { to: '/supervisor/thesis', label: 'Thesis Review', icon: 'book', badge: pendingThesis > 0 ? pendingThesis : null },
        { to: '/supervisor/publications', label: 'Publications', icon: 'pen' },
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
        { to: '/supervisor/notifications', label: 'Notifications', icon: 'bell' },
        { to: '/supervisor/profile', label: 'Profile', icon: 'user' },
      ],
    },
  ]

  const totalPending = pendingSynopsis + pendingThesis;

  return (
    <PortalLayout
      title="Supervisor Portal"
      subtitle="Academic Review"
      navSections={NAV_SECTIONS}
      userFallback="D"
      roleLabel="Senior Supervisor"
      notice={totalPending > 0 ? { icon: 'clipboard', label: 'REVIEW QUEUE', value: `${totalPending} items pending`, tone: 'danger' } : null}
    />
  )
}
