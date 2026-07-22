import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const deptSummary = [
  { name: 'Full Time', value: 210, fill: '#3B82F6' },
  { name: 'Part Time', value: 85, fill: '#8B5CF6' },
  { name: 'Research\nCompleted', value: 125, fill: '#10B981' },
  { name: 'Projects\nOn Hold', value: 42, fill: '#F59E0B' },
]

const recentActivity = [
  { icon: '📄', text: 'Thesis Submission: Arjun Mehta uploaded Phase II documentation.', time: '2 hours ago · Machine Learning', color: '#3B82F6' },
  { icon: '🏆', text: 'Grant Approved: Quantum Computing Lab secured $45k funding.', time: '5 hours ago · Department News', color: '#10B981' },
  { icon: '👤', text: 'New Supervisor: Dr. Sarah Chen joined the AI research wing.', time: 'Yesterday · HR Update', color: '#8B5CF6' },
  { icon: '⚠️', text: 'Deadline Alert: Annual Progress Reports due in 3 days.', time: 'Yesterday · Administration', color: '#F59E0B' },
]

const milestones = [
  { icon: '📊', label: 'PROGRESS REVIEW', title: 'Ph.D. Batch 2021', sub: 'Status: In Preparation', date: 'Oct 25', urgent: false },
  { icon: '📰', label: 'JOURNAL SUBMISSIONS', title: 'IEEE Transaction Q4', sub: 'Status: Pending Review', date: 'Nov 12', urgent: false },
  { icon: '🏛️', label: 'AUDIT SUBMISSION', title: 'Institutional Compliance', sub: 'Status: Critical', date: 'Dec 05', urgent: true },
]

export default function HODDashboard() {
  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">HOD Dashboard</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Research RMS · HOD Administration
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
          borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 8px 32px rgba(15,23,42,0.25)',
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              Welcome, <span style={{ color: '#60A5FA' }}>HOD!</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              The Computer Science Department research output is up by 12% this quarter.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost btn-sm" style={{ color: '#93C5FD', borderColor: 'rgba(147,197,253,0.3)' }}>
              📥 Export Report
            </button>
            <button style={{
              padding: '9px 18px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)', color: '#fff',
              fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
            }}>
              ＋ New Allocation
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Scholars', value: '420', sub: '+15% QoQ', icon: '🎓', color: 'blue', trend: 'up' },
            { label: 'Supervisors', value: '35', sub: 'Stable', icon: '👨‍🏫', color: 'green', trend: 'neutral' },
            { label: 'Ongoing Research', value: '385', sub: 'Active', icon: '🔬', color: 'purple', trend: 'up' },
            { label: 'Completed Research', value: '125', sub: '+12 Months', icon: '✅', color: 'orange', trend: 'up' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: '11px', marginTop: '3px', color: s.sub === 'Stable' ? '#10B981' : s.sub === 'Active' ? '#3B82F6' : '#F59E0B', fontWeight: 600 }}>
                  {s.trend === 'up' ? '▲' : '●'} {s.sub}
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
                <span style={{ fontSize: '12px', background: '#DBEAFE', color: '#1D4ED8', padding: '3px 10px', borderRadius: '99px', fontWeight: 700 }}>Academic Year 2023-24</span>
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
              <span style={{ color: '#3B82F6', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {recentActivity.map((act, i) => (
                <div key={i} style={{ padding: '10px 20px', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.color, marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '2px' }}>{act.text}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Milestone */}
            <div style={{ margin: '12px 16px', padding: '12px', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>NEXT MILESTONE</div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E40AF' }}>Dept. Research Seminar</div>
              <div style={{ fontSize: '11px', color: '#3B82F6', marginTop: '2px' }}>Oct 28, 2023 · Conference Hall 5</div>
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
                border: `1.5px solid ${m.urgent ? '#FCA5A5' : 'var(--border)'}`,
                background: m.urgent ? '#FEF2F2' : '#F8FAFC',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{m.icon} {m.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: m.urgent ? '#EF4444' : '#3B82F6', background: m.urgent ? '#FEE2E2' : '#DBEAFE', padding: '1px 7px', borderRadius: '99px' }}>{m.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>{m.title}</div>
                <div style={{ fontSize: '12px', color: m.urgent ? '#EF4444' : 'var(--text-secondary)', fontWeight: 500 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
