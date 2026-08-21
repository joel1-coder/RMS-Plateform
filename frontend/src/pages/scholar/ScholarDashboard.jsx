import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'

const progressTimeline = [
  { month: 'Aug 21', progress: 5 },
  { month: 'Jan 22', progress: 15 },
  { month: 'Jun 22', progress: 28 },
  { month: 'Jan 23', progress: 42 },
  { month: 'Jun 23', progress: 55 },
  { month: 'Jan 24', progress: 63 },
  { month: 'Jul 24', progress: 68 },
]

const milestones = [
  { label: 'Course Work',         date: 'Dec 2021', done: true },
  { label: 'Synopsis Submission', date: 'Mar 2022', done: true },
  { label: 'DRC Approval',        date: 'May 2022', done: true },
  { label: 'Literature Review',   date: 'Dec 2022', done: true },
  { label: 'Data Collection',     date: 'Jun 2023', done: true },
  { label: 'Thesis Writing',      date: 'Dec 2023', done: true },
  { label: 'Final Submission',    date: 'Sep 2024', done: false },
  { label: 'Viva Voce',           date: 'Nov 2024', done: false },
]

const recentActivity = [
  { icon: '📋', text: 'Synopsis approved by DRC',           time: '2 weeks ago',  type: 'success' },
  { icon: '📄', text: 'Thesis Chapter 3 submitted',         time: '5 days ago',   type: 'info' },
  { icon: '🔔', text: 'Feedback received from supervisor',  time: '3 days ago',   type: 'warning' },
  { icon: '📅', text: 'Viva voce date tentatively set',     time: '1 day ago',    type: 'primary' },
]

export default function ScholarDashboard() {
  const { user } = useAuth()

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">My Dashboard</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}! Here's your PhD journey at a glance.
          </span>
        </div>
        <div className="topbar-actions">
          <button className="topbar-btn">🔔<span className="badge-dot" /></button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}>
            ＋ Upload Document
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Hero Progress Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #065F46 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          marginBottom: '24px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, right: 100, width: 140, height: 140, borderRadius: '50%', background: 'rgba(16,185,129,0.08)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>PhD Progress</div>
              <div style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1 }}>68%</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>Thesis Writing Stage · 3rd Year</div>
              <div style={{ marginTop: '16px', width: '300px', maxWidth: '100%' }}>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '68%', background: 'linear-gradient(90deg,#10B981,#34D399)', borderRadius: '99px', transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Supervisor', value: user?.assignedSupervisor || 'Not Assigned' },
                { label: 'Department', value: user?.dept || 'Not Assigned' },
                { label: 'Registration', value: user?.registrationNumber || 'Not Assigned' },
                { label: 'Expected Completion', value: 'Dec 2024' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '12px 16px', minWidth: '160px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Publications',     value: '4',       icon: '📰', color: 'purple', sub: '2 pending review' },
            { label: 'Documents Filed',  value: '18',      icon: '📁', color: 'blue',   sub: '3 uploaded this month' },
            { label: 'Days Since Reg.',  value: '1051',    icon: '📅', color: 'green',  sub: 'Aug 2021 onwards' },
            { label: 'Feedback Items',   value: '7',       icon: '💬', color: 'orange', sub: '2 unread' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Progress Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Research Progress Over Time</div>
                <div className="card-subtitle">Monthly progress tracking since enrollment</div>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={progressTimeline}>
                  <defs>
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} formatter={v => [`${v}%`, 'Progress']} />
                  <Area type="monotone" dataKey="progress" stroke="#10B981" strokeWidth={2.5} fill="url(#progressGrad)" dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Milestones */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">PhD Milestones</div>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {milestones.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: m.done ? '#10B981' : 'var(--border)',
                      border: m.done ? '2px solid #10B981' : '2px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: m.done ? '#fff' : 'var(--text-muted)',
                    }}>
                      {m.done ? '✓' : (i + 1)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: m.done ? 600 : 400, color: m.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{m.label}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{m.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity + Upcoming */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
            </div>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: a.type === 'success' ? '#D1FAE5' : a.type === 'info' ? '#DBEAFE' : a.type === 'warning' ? '#FEF3C7' : '#EDE9FE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{a.text}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Upcoming Deadlines</div>
            </div>
            <div className="card-body">
              {[
                { task: 'Final Thesis Submission', date: 'Sep 30, 2024', days: 74, urgent: false },
                { task: 'Chapter 4 Review with Supervisor', date: 'Aug 05, 2024', days: 18, urgent: true },
                { task: 'Publication Deadline (IJCA)', date: 'Aug 15, 2024', days: 28, urgent: true },
                { task: 'Progress Report Submission', date: 'Aug 31, 2024', days: 44, urgent: false },
              ].map((d, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    background: d.urgent ? '#FEF3C7' : '#EDE9FE',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: d.urgent ? '#D97706' : '#6C63FF', lineHeight: 1 }}>{d.days}</span>
                    <span style={{ fontSize: '9px', color: d.urgent ? '#D97706' : '#6C63FF', fontWeight: 600 }}>days</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{d.task}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{d.date}</div>
                  </div>
                  {d.urgent && <span className="badge badge-warning" style={{ fontSize: '10px' }}>Urgent</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
