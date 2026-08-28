import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const STATUS_COLORS = { Active: 'badge-success', Completed: 'badge-info', 'On Hold': 'badge-warning', Inactive: 'badge-danger' }
const AREA_COLORS = { 'Quantum Computing': '#174EA6', 'Machine Learning': '#174EA6', 'Biotechnology': '#1E7D45', 'Renewable Energy': '#C89B1E', 'Cybersecurity': '#B4232A', 'Data Science': '#B4232A' }

export default function DepartmentScholars() {
  const { user } = useAuth()
  const [scholars, setScholars] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [areaFilter, setAreaFilter] = useState('All Areas')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('rms_token')
        const deptFilter = user?.dept && user.dept !== 'All' ? `&dept=${user.dept}` : ''
        const res = await fetch(`/api/users?role=scholar${deptFilter}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch scholars')
        const data = await res.json()
        setScholars(data)
      } catch (err) {
        toast.error('Failed to load department scholars')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.dept])

  const filtered = scholars.filter(s => {
    const matchStatus = statusFilter === 'All' || s.status === statusFilter
    const sArea = s.profile?.area || 'N/A'
    const matchArea = areaFilter === 'All Areas' || sArea === areaFilter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                        (s.profile?.regNo || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchArea && matchSearch
  })

  const total = scholars.length
  const unassigned = scholars.filter(s => !s.assignedSupervisorId).length
  const completed = scholars.filter(s => s.status === 'Completed').length

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" style={{ borderColor: 'rgba(23,78,166,0.18)', borderTopColor: '#174EA6' }} />
    </div>
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Department Scholars</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Oversee research progress and manage supervisor allocations for PhD candidates
          </span>
        </div>
      </div>

      <div className="page-body">

        {/* Status Filter Tabs + Area Filter */}
        <div className="filter-bar" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', borderRadius: 'var(--radius-md)', padding: '3px' }}>
            {['All', 'Active', 'Completed', 'On Hold'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                background: statusFilter === s ? '#fff' : 'transparent',
                color: statusFilter === s ? '#174EA6' : 'var(--text-secondary)',
                boxShadow: statusFilter === s ? 'var(--shadow-sm)' : 'none',
              }}>{s}</button>
            ))}
          </div>
          <select className="form-control form-select" style={{ width: '160px' }} value={areaFilter} onChange={e => setAreaFilter(e.target.value)}>
            <option value="All Areas">All Areas</option>
            {[...new Set(scholars.map(s => s.profile?.area).filter(Boolean))].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm">More Filters</button>
          <button className="btn btn-ghost btn-sm"> Export CSV</button>
        </div>

        <div className="card">
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Register Number</th>
                  <th>Research Area</th>
                  <th>Supervisor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: AREA_COLORS[s.profile?.area] || '#174EA6' }}>{s.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{s.profile?.regNo || 'N/A'}</td>
                    <td>
                      <span style={{ padding: '3px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: `${AREA_COLORS[s.profile?.area] || '#64748b'}18`, color: AREA_COLORS[s.profile?.area] || '#64748b' }}>
                        {s.profile?.area || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {s.assignedSupervisor ? (
                        <span style={{ fontSize: '12.5px', fontWeight: 600 }}>{s.assignedSupervisor}</span>
                      ) : (
                        <Link to="/hod/allocations" style={{ textDecoration: 'none' }}>
                          <button className="btn btn-warning btn-sm" style={{ fontSize: '11px', padding: '3px 10px', background: '#FFF6D8', color: '#936C00', border: '1px solid #FCD34D' }}>
                            Assign Supervisor
                          </button>
                        </Link>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[s.status] || 'badge-secondary'}`}>{s.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-ghost btn-sm" title="View"></button>
                        <button className="btn btn-ghost btn-sm" title="Edit"></button>
                        {s.assignedSupervisorId && (
                          <button className="btn btn-ghost btn-sm" title="Reassign" onClick={() => toast('Go to Allocations tab to reassign')}></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '16px 20px', borderTop: '1px solid var(--border)', background: '#FAFBFF' }}>
            {[
              { label: 'TOTAL SCHOLARS', value: total, sub: 'In Department', icon: '', color: '#174EA6' },
              { label: 'UNASSIGNED', value: unassigned, sub: 'Requires attention', icon: '', color: '#B4232A' },
              { label: 'COMPLETED', value: completed, sub: 'Successfully defended', icon: '', color: '#1E7D45' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', borderRadius: 'var(--radius-md)', background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '22px' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value.toString().padStart(2, '0')}</div>
                  <div style={{ fontSize: '11px', color: s.color === '#B4232A' ? '#B4232A' : 'var(--text-muted)' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
