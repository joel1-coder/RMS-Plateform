import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const scholarProgress = [
  { name: 'Rahul S.', progress: 75, status: 'On Track', dept: 'CS' },
  { name: 'Neha P.', progress: 60, status: 'On Track', dept: 'ECE' },
  { name: 'Amit K.', progress: 92, status: 'Excellent', dept: 'CS' },
  { name: 'Sonal J.', progress: 45, status: 'On Track', dept: 'CS' },
  { name: 'Vikram S.', progress: 30, status: 'Needs Attention', dept: 'Mech' },
  { name: 'Pooja M.', progress: 18, status: 'Needs Attention', dept: 'CS' },
]

const recentPubs = [
  { scholar: 'Rahul Sharma', title: 'Deep Learning for Medical Image Classification', journal: 'IEEE Access', status: 'Approved', type: 'SCI' },
  { scholar: 'Neha Patel', title: 'IoT-based Smart Agriculture: A Review', journal: 'Springer LNCS', status: 'Under Review', type: 'Scopus' },
  { scholar: 'Amit Kumar', title: 'Blockchain for Supply Chain Transparency', journal: 'Nature Energy', status: 'Approved', type: 'SCI' },
  { scholar: 'Sonal Joshi', title: 'NLP Approaches for Clinical Decision Support', journal: 'Expert Systems', status: 'Pending', type: 'Scopus' },
]

const milestones = [
  { task: 'Synopsis Review – Pooja M.', date: 'Jul 20, 2024', type: 'synopsis', urgent: true },
  { task: 'Thesis Chapter 4 – Rahul S.', date: 'Jul 25, 2024', type: 'thesis', urgent: true },
  { task: 'DRC Progress Meeting', date: 'Jul 28, 2024', type: 'meeting', urgent: false },
  { task: 'Progress Report – Neha P.', date: 'Jul 31, 2024', type: 'report', urgent: false },
]

const PROGRESS_COLOR = pct => pct >= 80 ? '#10B981' : pct >= 50 ? '#6C63FF' : '#EF4444'

export default function SupervisorDashboard() {
  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 28px', background: '#fff', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
            Dashboard
          </div>
          <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>
            Welcome back, Dr. Sarah Jenkins
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input style={{ padding: '8px 16px 8px 36px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', fontSize: '13px', width: '220px', color: 'var(--text-primary)', background: '#F8FAFC' }} placeholder="Search scholars or documents..." />
          <button className="topbar-btn" style={{ position: 'relative' }}>
            🔔
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', border: '2px solid #fff' }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>D</div>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Active Scholars', value: '8', sub: '+2 this semester', icon: '👥', color: 'blue', badge: null },
            { label: 'Pending Synopsis', value: '3', sub: 'Requires Action', icon: '📋', color: 'red', badge: 'urgent' },
            { label: 'Pending Thesis', value: '1', sub: 'Requires Action', icon: '📚', color: 'red', badge: 'urgent' },
            { label: 'Upcoming Meetings', value: '2', sub: 'Next: Today 3:00 PM', icon: '📅', color: 'green', badge: null },
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
                <div className="card-subtitle">PhD completion percentage by scholar</div>
              </div>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scholarProgress} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} formatter={v => [`${v}%`, 'Progress']} />
                  <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                    {scholarProgress.map((entry, i) => (
                      <Cell key={i} fill={PROGRESS_COLOR(entry.progress)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Upcoming Milestones</div>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div className="card-body" style={{ padding: '4px 0' }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ padding: '10px 20px', borderBottom: i < milestones.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                    background: m.type === 'synopsis' ? '#EDE9FE' : m.type === 'thesis' ? '#DBEAFE' : m.type === 'meeting' ? '#D1FAE5' : '#FEF3C7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                  }}>
                    {m.type === 'synopsis' ? '📋' : m.type === 'thesis' ? '📚' : m.type === 'meeting' ? '📅' : '📊'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{m.task}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.date}</div>
                  </div>
                  {m.urgent && <span style={{ background: '#FEE2E2', color: '#EF4444', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '99px', flexShrink: 0, marginTop: '3px' }}>URGENT</span>}
                </div>
              ))}
            </div>
            {/* Quick Actions */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Quick Actions</div>
              {['📅 Schedule Meeting', '📋 Review Synopsis', '📚 Review Thesis'].map((action, i) => (
                <button key={i} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', gap: '8px', width: '100%', textAlign: 'left', fontSize: '12.5px' }}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Publications */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Publications</div>
              <div className="card-subtitle">Scholar publications requiring your verification</div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>View All</button>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar</th><th>Publication Title</th><th>Journal</th><th>Index</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPubs.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: `hsl(${i * 70},60%,55%)` }}>{p.scholar.charAt(0)}</div>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.scholar}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '12.5px' }}>{p.title}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{p.journal}</td>
                    <td>
                      <span className={`badge ${p.type === 'SCI' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '10px' }}>{p.type}</span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Approved' ? 'badge-success' : p.status === 'Under Review' ? 'badge-warning' : 'badge-info'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-ghost btn-sm">👁️</button>
                        {p.status !== 'Approved' && <button className="btn btn-success btn-sm" style={{ fontSize: '11px', padding: '4px 10px' }}>Verify</button>}
                        {p.status !== 'Approved' && <button className="btn btn-primary btn-sm" style={{ fontSize: '11px', padding: '4px 10px', background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>Approve</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
