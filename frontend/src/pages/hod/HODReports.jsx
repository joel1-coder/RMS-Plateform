import { useState } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const pieData = [
  { name: 'AI/ML (40%)', value: 57, color: '#174EA6' },
  { name: 'ML (25%)', value: 36, color: '#174EA6' },
  { name: 'Data Sci (10%)', value: 14, color: '#C89B1E' },
  { name: 'Cyber (9%)', value: 13, color: '#1E7D45' },
  { name: 'Other (16%)', value: 22, color: '#E5E7EB' },
]

const lineData = [
  { year: '2018', rate: 68 },
  { year: '2019', rate: 72 },
  { year: '2020', rate: 76 },
  { year: '2021', rate: 81 },
  { year: '2022', rate: 88 },
  { year: '2023', rate: 94.2 },
]

const scholars = [
  { id: 'REG-2023-034', name: 'Aravind Sharma', status: 'Active', statusClass: 'badge-success', supervisor: 'Dr. Robert Chen', area: 'Machine Learning' },
  { id: 'REG-2021-089', name: 'Elena Rodriguez', status: 'Completed', statusClass: 'badge-info', supervisor: 'Prof. Sarah Jenkins', area: 'Artificial Intelligence' },
  { id: 'REG-2022-112', name: 'Michael Kim', status: 'Under Review', statusClass: 'badge-warning', supervisor: 'Dr. Alan Turing', area: 'Cybersecurity' },
  { id: 'REG-2023-002', name: 'Linda Wu', status: 'On Hold', statusClass: 'badge-danger', supervisor: 'Dr. Gregory House', area: 'Data Science' },
  { id: 'REG-2023-045', name: 'James Wilson', status: 'Active', statusClass: 'badge-success', supervisor: 'Prof. Lisa Cuddy', area: 'Machine Learning' },
]

const bottomKPIs = [
  { label: 'Yearly Projection', value: '+12.4%', sub: 'vs last year', icon: '', bg: '#F3F7FF', color: '#0A2A66' },
  { label: 'Approval Rate', value: '94.2%', sub: 'High Efficiency', icon: '', bg: '#E7F4EC', color: '#166A3A' },
  { label: 'Pending Reviews', value: '18', sub: 'Require attention', icon: '', bg: '#FFF6D8', color: '#936C00' },
]

export default function HODReports() {
  const [chartMode, setChartMode] = useState('Annual')

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div style={{ fontWeight: 800, fontSize: '18px' }}>Research Management System</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Reports & Analytics - Departmental performance and research distribution overview</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm"> Export Excel</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }}> Download PDF</button>
        </div>
      </div>

      <div className="page-body">
        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', marginBottom: '20px' }}>
          {/* Pie chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Scholars by Research Area Info</div>
            </div>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '240px' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800 }}>142</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pieData.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Completion Rate Trends</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Annual', 'Quarterly'].map(m => (
                  <button key={m} onClick={() => setChartMode(m)} style={{
                    padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    background: chartMode === m ? '#174EA6' : '#F1F5F9',
                    color: chartMode === m ? '#fff' : 'var(--text-secondary)',
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: '0 16px 16px', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '-4px' }}>Historical progression over the last 5 years</div>
            <div className="card-body" style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
                  <Tooltip formatter={v => [`${v}%`, 'Completion Rate']} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="rate" stroke="#174EA6" strokeWidth={2.5} dot={{ fill: '#174EA6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Scholar Performance Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Scholar Performance Summary</div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Showing 1-10 of 143 scholars </span>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Status</th>
                  <th>Supervisor Name</th>
                  <th>Research Area</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholars.map((s, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#174EA6' }}>{s.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${s.statusClass}`}>{s.status}</span></td>
                    <td style={{ fontSize: '13px', fontWeight: 600 }}>{s.supervisor}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{s.area}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm">More</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
            {bottomKPIs.map((k, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: k.bg, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px' }}>{k.icon}</span>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: k.color, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{k.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{k.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
