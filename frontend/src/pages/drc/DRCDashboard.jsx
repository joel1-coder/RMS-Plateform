import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const drcStats = [
  { label: 'Active Committees', value: '12', icon: '👥', color: 'blue', sub: 'Across CS & Biotech' },
  { label: 'Meetings Scheduled', value: '03', icon: '📅', color: 'green', sub: 'Next: Oct 25, 10 AM' },
  { label: 'Approved YTD', value: '48', icon: '✅', color: 'teal', sub: 'On track' },
]

const activityData = [
  { name: 'Jan-Mar', Approved: 12, Rejected: 2 },
  { name: 'Apr-Jun', Approved: 18, Rejected: 4 },
  { name: 'Jul-Sep', Approved: 15, Rejected: 1 },
  { name: 'Oct-Dec', Approved: 18, Rejected: 3 },
]


const upcomingMeetings = [
  { id: 1, title: 'DRC Evaluation Panel (CS)', date: 'Oct 25, 2023', time: '10:00 AM', room: 'Conference Hall A', members: ['Dr. Mohan Reddy', 'Dr. Sarah Chen', 'Prof. Alan Turing'] },
  { id: 2, title: 'Synopsis Review Board', date: 'Nov 02, 2023', time: '02:30 PM', room: 'Virtual Room 4', members: ['Dr. Mohan Reddy', 'Dr. Linda Gray'] },
]

export default function DRCDashboard() {
  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">DRC Dashboard</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Research RMS · DRC Administration
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {drcStats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2 Column Main Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Activity / Performance Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">DRC Approvals & Reviews</div>
                <div className="card-subtitle">Quarterly breakdown of research submissions evaluation</div>
              </div>
              <span className="badge badge-success">Target Achieved</span>
            </div>
            <div className="card-body" style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="Approved" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions & Milestones */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Quick Tasks Panel</div>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: '📝 Document Review', desc: 'Verify 5 pending synopses submissions', color: 'orange' },
                { title: '👥 Select Committee Panel', desc: 'Assign 3 faculty members to evaluation panel', color: 'blue' },
                { title: '📅 Schedule DRC Meeting', desc: 'Coordinate next VIVA reviews for CS Batch 2021', color: 'green' },
              ].map((t, idx) => (
                <div key={idx} style={{
                  padding: '12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                  background: '#F8FAFC', display: 'flex', gap: '10px', alignItems: 'start'
                }}>
                  <div style={{ marginTop: '2px' }}>🟢</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{t.title}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {/* Upcoming Meetings */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Upcoming DRC Meetings</div>
            </div>
            <div style={{ padding: '8px 16px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingMeetings.map(m => (
                  <div key={m.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{m.title}</span>
                      <span className="badge badge-info" style={{ fontSize: '9px' }}>{m.room}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>📅 {m.date} at {m.time}</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {m.members.map((mem, idx) => (
                        <span key={idx} style={{ fontSize: '9px', background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{mem}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
