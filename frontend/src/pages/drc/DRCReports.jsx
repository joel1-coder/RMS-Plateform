import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const pieData = [
  { name: 'Approved', value: 48, color: '#0D9488' },
  { name: 'Pending Review', value: 5, color: '#F59E0B' },
  { name: 'Requires Revision', value: 2, color: '#EF4444' },
]

const barData = [
  { name: 'Computer Science', count: 18 },
  { name: 'Biotechnology', count: 12 },
  { name: 'Mathematics', count: 8 },
  { name: 'Electrical Eng', count: 15 },
]

const recentApprovals = [
  { scholar: 'Chen Wei', dept: 'Computer Science', topic: 'Distributed Security Systems in Web3.0', approvedDate: 'Oct 20, 2023', status: 'Approved' },
  { scholar: 'Marcus Thorne', dept: 'Biotechnology', topic: 'Biotech Synopsis Review Board Approval', approvedDate: 'Oct 10, 2023', status: 'Approved' },
]

export default function DRCReports() {
  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">DRC Reports & Analytics</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Analyze synopsis evaluation metrics, committee loads and decision distribution.</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: '#0D9488' }}>
            📥 Export Report Summary
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px', marginBottom: '24px' }}>
          {/* Pie Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Synopsis Evaluation Status</span>
            </div>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '220px' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800 }}>55</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>TOTAL</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {pieData.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{p.name} ({p.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Scholars Enrollment by Department</span>
            </div>
            <div className="card-body" style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Decisions Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Approved Synopses</span>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Department</th>
                  <th>Research Topic</th>
                  <th>Approval Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApprovals.map((r, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#0F766E' }}>{r.scholar.charAt(0)}</div>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{r.scholar}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px' }}>{r.dept}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>{r.topic}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{r.approvedDate}</td>
                    <td>
                      <span className="badge badge-success">{r.status}</span>
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
