import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function MyScholars() {
  const { user } = useAuth()
  const [scholars, setScholars] = useState([])
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    if (!user) return

    // 1. Load users from localStorage (dynamic user management)
    let dbUsers = []
    try {
      const rawUsers = localStorage.getItem('rms_all_users')
      if (rawUsers) dbUsers = JSON.parse(rawUsers)
    } catch (e) {
      console.error('Failed to parse rms_all_users', e)
    }

    // 2. Filter scholars assigned to this logged-in supervisor
    const supervisorName = user.name || ''
    const assignedScholars = dbUsers.filter(
      u => u.role?.toLowerCase() === 'scholar' &&
           u.assignedSupervisor &&
           u.assignedSupervisor.toLowerCase() === supervisorName.toLowerCase()
    )

    // 3. Load research projects to enrich scholars with progress/topic
    let researchProjects = []
    try {
      const rawResearch = localStorage.getItem('rms_research')
      if (rawResearch) researchProjects = JSON.parse(rawResearch)
    } catch (e) {
      console.error('Failed to parse rms_research', e)
    }

    // 4. Join databases
    const enrichedScholars = assignedScholars.map(scholar => {
      // Find matching research project by scholar name
      const project = researchProjects.find(p => p.scholar.toLowerCase() === scholar.name.toLowerCase())
      
      const admissionYear = scholar.joined ? scholar.joined.split('-')[0] : '2024'
      
      return {
        id: scholar.id,
        name: scholar.name,
        email: scholar.email,
        dept: scholar.dept || 'Computer Science',
        topic: project ? project.topic : 'Research Topic Pending Registration',
        progress: project ? project.progress : 0,
        status: project 
          ? (project.status === 'Completed' ? 'Completed' : (project.progress >= 60 ? 'On Track' : 'Needs Attention'))
          : 'Pending',
        admission: admissionYear,
        lastReview: project ? project.startDate : 'N/A'
      }
    })

    setScholars(enrichedScholars)
  }, [user])

  const filtered = scholars.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          String(s.id).toLowerCase().includes(search.toLowerCase()) ||
                          s.topic.toLowerCase().includes(search.toLowerCase())
    const matchesDept = filterDept === 'All' || s.dept === filterDept
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Track': return 'badge-success'
      case 'Completed': return 'badge-info'
      case 'Needs Attention': return 'badge-warning'
      case 'Pending': return 'badge-gray'
      default: return 'badge-gray'
    }
  }

  // Get distinct departments for filter list
  const departments = [...new Set(scholars.map(s => s.dept))]

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">My Scholars</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Supervised candidates assigned to you by the system administrator
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Summary Info Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div className="card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🎓</span>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{scholars.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Supervised Scholars</div>
            </div>
          </div>
          <div className="card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🟢</span>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{scholars.filter(s => s.status === 'On Track' || s.status === 'Completed').length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active & On Track / Completed</div>
            </div>
          </div>
          <div className="card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>⚠️</span>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{scholars.filter(s => s.status === 'Needs Attention' || s.status === 'Pending').length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pending Topic / Action Needed</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                className="form-control" 
                placeholder="Filter by name, ID or topic..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            
            <select 
              className="form-control form-select" 
              style={{ width: '170px' }} 
              value={filterDept} 
              onChange={e => setFilterDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select 
              className="form-control form-select" 
              style={{ width: '150px' }} 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="Completed">Completed</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Pending">Pending</option>
            </select>

            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterDept('All'); setFilterStatus('All'); }}>Reset</button>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
              {filtered.length} of {scholars.length} scholars
            </span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Department</th>
                  <th>Research Topic</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: `hsl(${(s.id * 73) % 360}, 60%, 55%)` }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {s.id} · Adm: {s.admission}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.dept}</td>
                    <td style={{ maxWidth: '300px', fontSize: '12.5px', fontWeight: 500 }}>{s.topic}</td>
                    <td>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: '80px' }}>
                          <div className="progress-fill" style={{ width: `${s.progress}%`, background: s.progress >= 85 ? '#10B981' : s.progress >= 50 ? '#6C63FF' : '#EF4444' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '32px' }}>{s.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(s.status)}`}>{s.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => toast.success(`Viewing profile of ${s.name} (Email: ${s.email})`)}>
                          View Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No scholars assigned under your supervision yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
