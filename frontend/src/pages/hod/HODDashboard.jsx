import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const milestones = [
  { icon: '', label: 'PROGRESS REVIEW', title: 'Ph.D. Batch 2021', sub: 'Status: In Preparation', date: 'Oct 25', urgent: false },
  { icon: '', label: 'JOURNAL SUBMISSIONS', title: 'IEEE Transaction Q4', sub: 'Status: Pending Review', date: 'Nov 12', urgent: false },
  { icon: '', label: 'AUDIT SUBMISSION', title: 'Institutional Compliance', sub: 'Status: Critical', date: 'Dec 05', urgent: true },
]

export default function HODDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('rms_token')
        const res = await fetch('/api/reports/hod-dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        const result = await res.json()
        setData(result)
      } catch (err) {
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" style={{ borderColor: 'rgba(23,78,166,0.18)', borderTopColor: '#174EA6' }} />
    </div>
  )

  const { stats, deptSummary, recentActivities } = data
  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">HOD Dashboard</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Research RMS - HOD Administration
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #061B44 0%, #0A2A66 100%)',
          borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 8px 32px rgba(15,23,42,0.25)',
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              Welcome, <span style={{ color: '#F6D66E' }}>HOD!</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              The Computer Science Department research output is up by 12% this quarter.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost btn-sm" style={{ color: '#E8EEF8', borderColor: 'rgba(232,238,248,0.3)' }}>
               Export Report
            </button>
            <Link to="/hod/allocations" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '9px 18px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(90deg, #174EA6, #0A2A66)', color: '#fff',
                fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 12px rgba(23,78,166,0.28)',
              }}>
                + New Allocation
              </button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Scholars', value: stats.totalScholars, sub: 'In Department', icon: '', color: 'blue', trend: 'neutral' },
            { label: 'Supervisors', value: stats.supervisors, sub: 'Active', icon: '', color: 'green', trend: 'neutral' },
            { label: 'Ongoing Research', value: stats.activeResearch, sub: 'In Progress', icon: '', color: 'blue', trend: 'neutral' },
            { label: 'Completed Research', value: stats.completedResearch, sub: 'Successfully Defended', icon: '', color: 'orange', trend: 'neutral' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: '11px', marginTop: '3px', color: s.sub === 'Active' ? '#1E7D45' : '#174EA6', fontWeight: 600 }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Department Summary + Recent Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Department Summary</div>
                  <div className="card-subtitle">Scholar distribution and milestones completion</div>
                </div>
                <span style={{ fontSize: '12px', background: '#E8EEF8', color: '#0A2A66', padding: '3px 10px', borderRadius: '99px', fontWeight: 700 }}>Academic Year 2023-24</span>
              </div>
              <div className="card-body" style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptSummary} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {deptSummary.map((entry, i) => (
                        <rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
              <span style={{ color: '#174EA6', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {recentActivities.length > 0 ? recentActivities.map((act, i) => (
                <div key={i} style={{ padding: '10px 20px', borderBottom: i < recentActivities.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.color || '#174EA6', marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '2px' }}>{act.text}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.time}</div>
                  </div>
                </div>
              )) : <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>No recent activity found.</div>}
            </div>

            {/* Next Milestone */}
            <div style={{ margin: '12px 16px', padding: '12px', background: 'linear-gradient(135deg, #F3F7FF, #E8EEF8)', borderRadius: 'var(--radius-md)', border: '1px solid #B9C9EA' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#0A2A66', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>NEXT MILESTONE</div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#0A2A66' }}>Dept. Research Seminar</div>
              <div style={{ fontSize: '11px', color: '#174EA6', marginTop: '2px' }}>Oct 28, 2023 - Conference Hall 5</div>
            </div>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Upcoming Milestones</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '16px 20px' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${m.urgent ? '#F0B9BD' : 'var(--border)'}`,
                background: m.urgent ? '#F9E6E8' : '#F8FAFC',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{m.icon} {m.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: m.urgent ? '#B4232A' : '#174EA6', background: m.urgent ? '#F9E6E8' : '#E8EEF8', padding: '1px 7px', borderRadius: '99px' }}>{m.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>{m.title}</div>
                <div style={{ fontSize: '12px', color: m.urgent ? '#B4232A' : 'var(--text-secondary)', fontWeight: 500 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
