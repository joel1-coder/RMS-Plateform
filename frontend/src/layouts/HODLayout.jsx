import { useState, useEffect } from 'react'
import PortalLayout from './PortalLayout'
import { apiFetch } from '../utils/api'

export default function HODLayout() {
  const [pendingAllocations, setPendingAllocations] = useState(0)

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const token = sessionStorage.getItem('rms_token')
        const res = await apiFetch('/api/users?role=scholar', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const scholars = await res.json()
          const unassigned = scholars.filter(s => !s.assignedSupervisor).length
          setPendingAllocations(unassigned)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchAllocations()
  }, [])

  const NAV = [
    { to: '/hod', label: 'Dashboard', icon: 'dashboard', exact: true },
    { to: '/hod/scholars', label: 'Department Scholars', icon: 'graduation' },
    { to: '/hod/supervisors', label: 'Supervisors', icon: 'users' },
    { to: '/hod/users', label: 'User Management', icon: 'admin' },
    { to: '/hod/allocations', label: 'Allocations', icon: 'link', badge: pendingAllocations > 0 ? pendingAllocations : null },
    { to: '/hod/reports', label: 'Reports', icon: 'file' },
    { to: '/hod/notifications', label: 'Notifications', icon: 'bell' },
  ]

  return (
    <PortalLayout
      title="HOD Portal"
      subtitle="Department Management"
      navSections={[{ label: 'DEPARTMENT', items: NAV }]}
      userFallback="H"
      roleLabel="Head of Department"
      notice={pendingAllocations > 0 ? { icon: 'link', label: 'PENDING ALLOCATION', value: `${pendingAllocations} scholars unassigned`, tone: 'warning' } : null}
    />
  )
}
