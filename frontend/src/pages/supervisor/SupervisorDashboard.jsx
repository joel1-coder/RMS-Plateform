import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../utils/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PROGRESS_COLOR = pct => pct >= 80 ? '#10B981' : pct >= 50 ? '#6C63FF' : '#EF4444'

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const [scholars, setScholars] = useState([])
  const [synopses, setSynopses] = useState([])
  const [theses, setTheses] = useState([])
  const [projects, setProjects] = useState([])
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem('rms_token')
        const headers = { 'Authorization': `Bearer ${token}` }

        const [usersRes, synRes, thRes, resRes, pubRes] = await Promise.all([
          apiFetch('/api/users?role=scholar', { headers }),
          apiFetch('/api/submissions?type=synopsis', { headers }),
          apiFetch('/api/thesis', { headers }),
          apiFetch('/api/research', { headers }),
          apiFetch('/api/publication', { headers })
        ])

        let userScholars = []
        if (usersRes.ok) {
          const allScholars = await usersRes.json()
          const myName = (user?.name || '').toLowerCase()
          userScholars = allScholars.filter(s =>
            (s.assignedSupervisorId && (s.assignedSupervisorId === user?.id || s.assignedSupervisorId === user?._id)) ||
            (s.assignedSupervisor && s.assignedSupervisor.toLowerCase() === myName)
          )
          setScholars(userScholars)
        }

        if (synRes.ok) {
          const synData = await synRes.json()
          setSynopses(synData)
        }

        if (thRes.ok) {
          const thData = await thRes.json()
          setTheses(thData)
        }

        if (resRes.ok) {
          const resData = await resRes.json()
          setProjects(resData)
        }

        if (pubRes.ok) {
          const pubData = await pubRes.json()
          setPublications(pubData)
        }
      } catch (err) {
        console.error('Failed to load supervisor dashboard data', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadDashboard()
    }
  }, [user])

  // Calculate dynamic stats
  const pendingSynCount = synopses.filter(s => s.status.includes('Pending') || s.status.includes('Supervisor')).length
  const pendingThCount = theses.filter(t => t.status === 'Pending').length

  // Build scholar progress list
  const chartData = scholars.map(s => {
    const proj = projects.find(p => (p.scholar || '').toLowerCase() === (s.name || '').toLowerCase())
    return {
      name: s.name.length > 12 ? s.name.slice(0, 10) + '..' : s.name,
      fullName: s.name,
      progress: proj?.progress || 0,
      dept: s.dept || 'CS'
    }
  })

  // Build upcoming milestones from real pending items
  const dynamicMilestones = []
  synopses.filter(s => s.status.includes('Pending') || s.status.includes('Supervisor')).forEach(s => {
    dynamicMilestones.push({
      task: `Synopsis Review – ${s.scholarName}`,
      date: s.submittedAt ? s.submittedAt.slice(0, 10) : 'Recent',
      type: 'synopsis',
      urgent: true,
      link: '/supervisor/synopsis'
    })
  })
  theses.filter(t => t.status === 'Pending').forEach(t => {
    dynamicMilestones.push({
      task: `Thesis Draft Review – ${t.scholar}`,
      date: t.submittedAt || 'Recent',
      type: 'thesis',
      urgent: true,
      link: '/supervisor/thesis'
    })
  })

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Supervisor Dashboard</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name ? `${user.name}` : 'Supervisor'}
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Active Scholars', value: loading ? '--' : scholars.length, sub: 'Assigned to you', icon: '👥', color: 'blue', badge: null },
            { label: 'Pending Synopsis', value: loading ? '--' : pendingSynCount, sub: pendingSynCount > 0 ? 'Requires Action' : 'Up to date', icon: '📋', color: 'red', badge: pendingSynCount > 0 ? 'urgent' : null },
            { label: 'Pending Thesis', value: loading ? '--' : pendingThCount, sub: pendingThCount > 0 ? 'Requires Action' : 'Up to date', icon: '📚', color: 'red', badge: pendingThCount > 0 ? 'urgent' : null },
            { label: 'Publications', value: loading ? '--' : publications.length, sub: 'Scholar publications', icon: '📰', color: 'green', badge: null },
          ].map((s, i) => (
            <div className="stat-card" key={i} style={{ position: 'relative' }}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {s.badge === 'urgent' && <span style={{ background: '#FEE2E2', color: '#EF4444', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '99px' }}>Requires Action</span>}
                  {!s.badge && <span style={{ color: 'var(--text-muted)' }}>{s.sub}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Scholar Progress Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Scholar Progress Overview</div>
                <div className="card-subtitle">PhD completion percentage for your assigned scholars</div>
              </div>
              <Link to="/supervisor/scholars" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading scholar progress...</div>
              ) : chartData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>👥</div>
                  <div>No scholars assigned to your supervision yet.</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Assigned scholars by HOD/Admin will appear here automatically.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 45)}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} unit="%" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} formatter={(v, n, item) => [`${v}%`, item?.payload?.fullName || 'Progress']} />
                    <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={PROGRESS_COLOR(entry.progress)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Pending Action Items</div>
            </div>
            <div className="card-body" style={{ padding: '4px 0' }}>
              {dynamicMilestones.length === 0 ? (
                <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  🎉 No pending synopsis or thesis reviews. All up to date!
                </div>
              ) : (
                dynamicMilestones.slice(0, 5).map((m, i) => (
                  <div key={i} style={{ padding: '10px 20px', borderBottom: i < dynamicMilestones.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      background: m.type === 'synopsis' ? '#EDE9FE' : '#DBEAFE',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    }}>
                      {m.type === 'synopsis' ? '📋' : '📚'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Link to={m.link} style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', lineHeight: 1.4 }}>
                        {m.task}
                      </Link>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.date}</div>
                    </div>
                    {m.urgent && <span style={{ background: '#FEE2E2', color: '#EF4444', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '99px', flexShrink: 0, marginTop: '3px' }}>ACTION</span>}
                  </div>
                ))
              )}
            </div>
            {/* Quick Actions */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Quick Actions</div>
              <Link to="/supervisor/synopsis" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', gap: '8px', width: '100%', textAlign: 'left', fontSize: '12.5px', textDecoration: 'none' }}>
                📋 Review Synopsis
              </Link>
              <Link to="/supervisor/thesis" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', gap: '8px', width: '100%', textAlign: 'left', fontSize: '12.5px', textDecoration: 'none' }}>
                📚 Review Thesis
              </Link>
              <Link to="/supervisor/schedule-dc-meeting" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', gap: '8px', width: '100%', textAlign: 'left', fontSize: '12.5px', textDecoration: 'none' }}>
                📅 Schedule DC Meeting
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Publications */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Publications</div>
              <div className="card-subtitle">Publications by your supervised scholars</div>
            </div>
            <Link to="/supervisor/publications" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)', textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {publications.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No publications submitted yet.
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Scholar</th><th>Publication Title</th><th>Journal / Venue</th><th>Type</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {publications.slice(0, 5).map((p, i) => (
                    <tr key={p.id || p._id || i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar avatar-sm" style={{ background: `hsl(${i * 70},60%,55%)` }}>{(p.scholarName || p.author || 'S').charAt(0)}</div>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.scholarName || p.author || 'Scholar'}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '12.5px' }}>{p.title}</td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{p.journal || p.venue || '—'}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '10px' }}>{p.pubType || 'Journal'}</span>
                      </td>
                      <td>
                        <span className={`badge ${p.status === 'Published' || p.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                          {p.status || 'Under Review'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
