import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const progressDist = [
  { name: 'On Track (60%)', value: 25, color: '#3B82F6' },
  { name: 'Excellent (25%)', value: 11, color: '#F59E0B' },
  { name: 'Needs Attention (15%)', value: 6, color: '#EF4444' },
]

const completionRates = [
  { name: 'Computer Science & AI', rate: 92, target: 85 },
  { name: 'Biotechnology', rate: 78, target: 85 },
  { name: 'Data Science', rate: 64, target: 85 },
]

const statusOverview = [
  { name: 'Alice Merton', id: 'ID: 2024-D501', dept: 'Data Science', milestone: 'Synopsis', progress: 45, status: 'In Progress' },
  { name: 'Robert Jenkins', id: 'ID: 2023-A109', dept: 'Computer Science', milestone: 'Thesis', progress: 88, status: 'Excellent' },
  { name: 'Sarah Khan', id: 'ID: 2022-BT44', dept: 'Biotechnology', milestone: 'Viva', progress: 12, status: 'Needs Attention' },
]

export default function ReportsAnalytics() {
  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Reports & Analytics</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Analyze scholar performance and institutional research metrics</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📄 Export as PDF</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>📊 Export as Excel</button>
        </div>
      </div>

      <div className="page-body">
        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Progress Distribution */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Scholar Progress Distribution</span>
            </div>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '220px' }}>
              <div style={{ width: '150px', height: '150px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressDist}
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {progressDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>42</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
                </div>
              </div>

              {/* Legends */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {progressDist.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Completion Rate</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Institutional Target: 85%</span>
            </div>
            <div className="card-body" style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionRates} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} width={120} />
                  <Tooltip formatter={v => [`${v}%`, 'Completion Rate']} />
                  <Bar dataKey="rate" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Scholar Status Overview */}
        <div className="card">
          <div className="card-header" style={{ padding: '12px 20px' }}>
            <span className="card-title">Scholar Status Overview</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Department</th>
                  <th>Current Milestone</th>
                  <th>Progress %</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {statusOverview.map((s, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#4F46E5' }}>{s.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{s.dept}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '10px' }}>{s.milestone}</span>
                    </td>
                    <td>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: '70px' }}>
                          <div className="progress-fill" style={{ width: `${s.progress}%`, background: s.progress >= 75 ? '#10B981' : s.progress >= 40 ? '#3B82F6' : '#EF4444' }} />
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700 }}>{s.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'Excellent' ? 'badge-success' : s.status === 'In Progress' ? 'badge-info' : 'badge-warning'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }}>View Report</button>
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
