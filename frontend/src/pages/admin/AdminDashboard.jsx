import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'

const monthlyData = [
  { month: 'Jan', scholars: 12, thesis: 4, viva: 2 },
  { month: 'Feb', scholars: 15, thesis: 6, viva: 3 },
  { month: 'Mar', scholars: 18, thesis: 5, viva: 4 },
  { month: 'Apr', scholars: 22, thesis: 8, viva: 6 },
  { month: 'May', scholars: 20, thesis: 7, viva: 5 },
  { month: 'Jun', scholars: 25, thesis: 10, viva: 8 },
  { month: 'Jul', scholars: 28, thesis: 12, viva: 9 },
]

const deptData = [
  { name: 'CS', value: 35, color: '#6C63FF' },
  { name: 'ECE', value: 20, color: '#10B981' },
  { name: 'Mech', value: 18, color: '#F59E0B' },
  { name: 'Civil', value: 15, color: '#3B82F6' },
  { name: 'Chem', value: 12, color: '#EF4444' },
]

const recentActivities = [
  { id: 1, user: 'Dr. Priya Kumar', action: 'Approved synopsis', target: 'Rahul Sharma', time: '2 min ago', type: 'success' },
  { id: 2, user: 'Prof. Anita Verma', action: 'Scheduled viva voce', target: 'Neha Patel', time: '15 min ago', type: 'info' },
  { id: 3, user: 'Admin', action: 'Added new scholar', target: 'Amit Kumar', time: '1 hr ago', type: 'primary' },
  { id: 4, user: 'Dr. Rajan Mehta', action: 'Rejected thesis draft', target: 'Sonal Joshi', time: '3 hrs ago', type: 'danger' },
  { id: 5, user: 'HOD', action: 'Updated department settings', target: 'CS Dept', time: '5 hrs ago', type: 'warning' },
]

const pendingActions = [
  { title: 'Synopsis Approvals', count: 8, color: '#F59E0B', icon: '📋' },
  { title: 'Thesis Reviews', count: 5, color: '#3B82F6', icon: '📚' },
  { title: 'Viva Scheduling', count: 3, color: '#6C63FF', icon: '🎓' },
  { title: 'User Registrations', count: 12, color: '#10B981', icon: '👥' },
]

export default function AdminDashboard() {
  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Admin Dashboard</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Welcome back! Here's what's happening today.
          </span>
        </div>
        <div className="topbar-actions">
          <button className="topbar-btn" title="Notifications">
            🔔
            <span className="badge-dot" />
          </button>
          <button className="topbar-btn" title="Profile">👤</button>
          <button className="btn btn-primary btn-sm">
            ＋ Add User
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats Grid */}
        <div className="stat-cards-grid">
          {[
            { label: 'Total Scholars', value: '248', icon: '🎓', color: 'purple', change: '+12%', up: true },
            { label: 'Supervisors', value: '42', icon: '👨‍🏫', color: 'blue', change: '+3%', up: true },
            { label: 'Active Research', value: '186', icon: '🔬', color: 'green', change: '+8%', up: true },
            { label: 'Pending Thesis', value: '23', icon: '📄', color: 'orange', change: '-5%', up: false },
            { label: 'Viva Scheduled', value: '11', icon: '📅', color: 'indigo', change: '+2', up: true },
            { label: 'Departments', value: '8', icon: '🏛️', color: 'red', change: 'Active', up: true },
          ].map((stat, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className={`stat-change ${stat.up ? 'up' : 'down'}`}>
                  {stat.up ? '↑' : '↓'} {stat.change} this month
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Bar Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Monthly Research Activity</div>
                <div className="card-subtitle">Scholars, Thesis & Viva trends</div>
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
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                  <Bar dataKey="scholars" fill="#6C63FF" radius={[4, 4, 0, 0]} name="Scholars" />
                  <Bar dataKey="thesis" fill="#10B981" radius={[4, 4, 0, 0]} name="Thesis" />
                  <Bar dataKey="viva" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Viva" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">By Department</div>
                <div className="card-subtitle">Scholar distribution</div>
              </div>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {deptData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} scholars`, '']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
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
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div>
              {recentActivities.map(act => (
                <div key={act.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                    background: act.type === 'success' ? '#10B981' : act.type === 'danger' ? '#EF4444' : act.type === 'info' ? '#3B82F6' : act.type === 'warning' ? '#F59E0B' : '#6C63FF',
                  }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{act.user}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}> {act.action} </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>{act.target}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Pending Actions</div>
              <span className="badge badge-danger">28 total</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingActions.map((action, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{action.icon}</span>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{action.title}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: action.color }}>{action.count}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(action.count / 15) * 100}%`, background: action.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px' }}>
                <div className="card-subtitle" style={{ marginBottom: '12px' }}>Quick Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Add Scholar', icon: '🎓' },
                    { label: 'Schedule Viva', icon: '📅' },
                    { label: 'Send Notice', icon: '📢' },
                    { label: 'Generate Report', icon: '📊' },
                  ].map((action, i) => (
                    <button key={i} className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', gap: '6px' }}>
                      {action.icon} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
