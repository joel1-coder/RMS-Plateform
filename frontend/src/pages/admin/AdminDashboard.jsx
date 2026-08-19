import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// ── fallback defaults used while loading or if DB is empty ──────────────────
const DEFAULT_MONTHLY = [
  { month: 'Jan', scholars: 0, thesis: 0, viva: 0 },
  { month: 'Feb', scholars: 0, thesis: 0, viva: 0 },
  { month: 'Mar', scholars: 0, thesis: 0, viva: 0 },
  { month: 'Apr', scholars: 0, thesis: 0, viva: 0 },
  { month: 'May', scholars: 0, thesis: 0, viva: 0 },
  { month: 'Jun', scholars: 0, thesis: 0, viva: 0 },
  { month: 'Jul', scholars: 0, thesis: 0, viva: 0 },
]

const STAT_META = [
  { key: 'totalScholars',  label: 'Total Scholars',  icon: '🎓', color: 'purple' },
  { key: 'supervisors',    label: 'Supervisors',      icon: '👨‍🏫', color: 'blue'   },
  { key: 'activeResearch', label: 'Active Research',  icon: '🔬', color: 'green'  },
  { key: 'pendingThesis',  label: 'Pending Thesis',   icon: '📄', color: 'orange' },
  { key: 'vivaScheduled',  label: 'Viva Scheduled',   icon: '📅', color: 'indigo' },
  { key: 'departments',    label: 'Departments',      icon: '🏛️', color: 'red'    },
]

export default function AdminDashboard() {
  const [stats, setStats]             = useState({ totalScholars: 0, supervisors: 0, activeResearch: 0, pendingThesis: 0, vivaScheduled: 0, departments: 0 })
  const [deptData, setDeptData]       = useState([])
  const [monthlyData, setMonthlyData] = useState(DEFAULT_MONTHLY)
  const [recentAct, setRecentAct]     = useState([])
  const [pendingAct, setPendingAct]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('rms_token')

    fetch('/api/reports/admin-dashboard', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        setStats(data.stats || {})
        if (data.deptData?.length)    setDeptData(data.deptData)
        if (data.monthlyData?.length) setMonthlyData(data.monthlyData)
        if (data.recentActivities)    setRecentAct(data.recentActivities)
        if (data.pendingActions)      setPendingAct(data.pendingActions)
      })
      .catch(err => {
        console.warn('Dashboard stats fetch failed – showing fallback data.', err)
        setError('Could not load live data. Showing cached values.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade">
      {/* ── Topbar (icons removed as requested) ── */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Admin Dashboard</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Welcome back! Here's what's happening today.
          </span>
        </div>
        {error && (
          <span style={{ fontSize: '11px', color: '#F59E0B', background: '#FEF3C7', padding: '4px 10px', borderRadius: 6 }}>
            ⚠ {error}
          </span>
        )}
      </div>

      <div className="page-body">
        {/* ── Stat Flashcards ── */}
        <div className="stat-cards-grid">
          {STAT_META.map(({ key, label, icon, color }) => (
            <div className="stat-card" key={key}>
              <div className={`stat-icon ${color}`}>{icon}</div>
              <div className="stat-info">
                <div className="stat-value">
                  {loading ? <span className="skeleton-text" style={{ width: 40, display:'inline-block' }}>--</span> : (stats[key] ?? 0)}
                </div>
                <div className="stat-label">{label}</div>
                <div className="stat-change up">Live from DB</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Bar Chart – Monthly Research Activity */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Monthly Research Activity</div>
                <div className="card-subtitle">Scholars, Thesis &amp; Viva trends</div>
              </div>
              <select className="form-control form-select" style={{ width: 'auto', fontSize: '12px', padding: '6px 28px 6px 10px' }}>
                <option>Last 7 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  />
                  <Bar dataKey="scholars" fill="#6C63FF" radius={[4, 4, 0, 0]} name="Scholars" />
                  <Bar dataKey="thesis"   fill="#10B981" radius={[4, 4, 0, 0]} name="Thesis" />
                  <Bar dataKey="viva"     fill="#F59E0B" radius={[4, 4, 0, 0]} name="Viva" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart – By Department */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">By Department</div>
                <div className="card-subtitle">Scholar distribution</div>
              </div>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              {deptData.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', fontSize: '13px' }}>
                  {loading ? 'Loading department data...' : 'No department data yet'}
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={deptData}
                        cx="50%" cy="50%"
                        innerRadius={45} outerRadius={72}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {deptData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [`${v} scholars`, '']}
                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {deptData.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                        {d.name}: {d.value}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div className="card-body" style={{ padding: '8px 0' }}>
              {loading ? (
                <div style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '13px' }}>Loading activity...</div>
              ) : recentAct.length === 0 ? (
                <div style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center' }}>
                  No recent activity found
                </div>
              ) : (
                recentAct.map((a, i) => (
                  <div key={a.id || i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 20px', borderBottom: i < recentAct.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: a.type === 'success' ? '#10B981' : a.type === 'danger' ? '#EF4444' : a.type === 'warning' ? '#F59E0B' : '#6C63FF'
                    }} />
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      <span style={{ fontWeight: 600 }}>{a.user}</span>
                      {' '}{a.action}{' '}
                      <span style={{ color: '#6C63FF', fontWeight: 500 }}>{a.target}</span>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {a.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Pending Actions</div>
              {pendingAct.length > 0 && (
                <span style={{
                  background: '#EF4444', color: '#fff',
                  borderRadius: 20, padding: '2px 10px', fontSize: '12px', fontWeight: 600
                }}>
                  {pendingAct.reduce((sum, p) => sum + (p.count || 0), 0)} total
                </span>
              )}
            </div>
            <div className="card-body" style={{ padding: '8px 20px 20px' }}>
              {loading ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Loading actions...</div>
              ) : pendingAct.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', paddingTop: 20 }}>
                  ✅ No pending actions
                </div>
              ) : (
                pendingAct.map((p, i) => (
                  <div key={i} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.icon} {p.title}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: p.color }}>{p.count}</span>
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 4, height: 4 }}>
                      <div style={{
                        width: `${Math.min((p.count / 20) * 100, 100)}%`,
                        background: p.color, height: '100%', borderRadius: 4,
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
