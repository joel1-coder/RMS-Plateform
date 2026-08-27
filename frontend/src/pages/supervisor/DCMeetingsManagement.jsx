import { useState } from 'react'
import toast from 'react-hot-toast'

const meetings = [
  { id: 1, scholar: 'Ananya Rao', regNo: 'PH-2021-013', date: 'Oct 24, 2023 - 10:30 AM', type: '1st DC Meeting', status: 'Scheduled', avatar: '#174EA6' },
  { id: 2, scholar: 'Julian Marsh', regNo: 'PH-2020-078', date: 'Oct 18, 2023 - 02:00 PM', type: 'Pre-Synopsis', status: 'Minutes Pending', avatar: '#1E7D45' },
  { id: 3, scholar: 'Li Tang', regNo: 'PH-2022-089', date: 'Oct 15, 2023 - 09:00 AM', type: '2nd DC Meeting', status: 'Completed', avatar: '#F59E0B' },
  { id: 4, scholar: 'Sarah Bennett', regNo: 'PH-2022-452', date: 'Nov 02, 2023 - 11:00 AM', type: 'Comprehensive Viva', status: 'Scheduled', avatar: '#B4232A' },
]

const STATUS_BADGE = {
  'Scheduled': { bg: '#DBEAFE', color: '#1D4ED8' },
  'Minutes Pending': { bg: '#FEF3C7', color: '#92400E' },
  'Completed': { bg: '#E7F4EC', color: '#166A3A' },
}

const upcomingCount = 8
const pendingMinutes = 3

export default function DCMeetingsManagement() {
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('Status: All')
  const [page, setPage] = useState(1)
  const totalPages = 3

  const handleExport = () => toast.success('Exporting meeting list...')

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">DC Meetings & Minutes</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Manage doctoral committee meetings and track minutes
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg,#F3F7FF,#E8EEF8)' }}>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#174EA6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upcoming Meetings</div>
                <span style={{ fontSize: '20px' }} />
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#061B44', lineHeight: 1 }}>{String(upcomingCount).padStart(2,'0')}</div>
              <div style={{ fontSize: '11.5px', color: '#0A2A66', marginTop: '4px' }}>Next meeting in 2 days</div>
            </div>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg,#FFF7ED,#FEF3C7)' }}>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Minutes</div>
                <span style={{ fontSize: '20px' }} />
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#92400E', lineHeight: 1 }}>{String(pendingMinutes).padStart(2,'0')}</div>
              <div style={{ fontSize: '11.5px', color: '#B45309', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ background: '#B4232A', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '99px' }}>3 Action Required</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Scholars Due for Review</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {['AR','JM','LT'].map((i, idx) => (
                  <div key={idx} style={{ width: 30, height: 30, borderRadius: '50%', background: ['#174EA6', '#1E7D45', '#C89B1E'][idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '11px', marginLeft: idx > 0 ? '-8px' : 0, border: '2px solid #fff' }}>{i}</div>
                ))}
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginLeft: '8px' }}>+4</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Reviews pending for the Fall semester.</div>
            </div>
          </div>
        </div>

        {/* Meetings Table */}
        <div className="card">
          <div className="card-header">
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>All Scheduled & Past Meetings</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                style={{ padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
                {['All Types', '1st DC Meeting', '2nd DC Meeting', 'Pre-Synopsis', 'Comprehensive Viva'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
                {['Status: All', 'Scheduled', 'Minutes Pending', 'Completed'].map(t => <option key={t}>{t}</option>)}
              </select>
              <button onClick={handleExport} className="btn btn-ghost btn-sm">Export List</button>
              <button
                style={{ padding: '7px 14px', background: 'linear-gradient(90deg,#0A2A66,#174EA6)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                Schedule New DC Meeting
              </button>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '24px' }}></th>
                  <th>SCHOLAR NAME</th>
                  <th>MEETING DATE & TIME</th>
                  <th>MEETING TYPE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map(m => (
                  <tr key={m.id}>
                    <td>
                      <input type="checkbox" style={{ width: '15px', height: '15px' }} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: m.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px' }}>
                          {m.scholar.split(' ').map(w => w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{m.scholar}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {m.regNo}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{m.date}</td>
                    <td>
                      <span style={{ background: '#E8EEF8', color: '#174EA6', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>{m.type}</span>
                    </td>
                    <td>
                      <span style={{ background: STATUS_BADGE[m.status]?.bg, color: STATUS_BADGE[m.status]?.color, fontSize: '11.5px', fontWeight: 600, padding: '3px 10px', borderRadius: '99px' }}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" title="View">View</button>
                        <button className="btn btn-ghost btn-sm" title="Calendar">Calendar</button>
                        {m.status === 'Minutes Pending' && (
                          <button style={{ padding: '4px 10px', background: '#B4232A', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            Record Minutes
                          </button>
                        )}
                        {m.status === 'Completed' && (
                          <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>View Report</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Showing 4 of 24 meetings</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Prev</button>
              {[1,2,3].map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: '6px 12px', border: `1px solid ${page === p ? '#0A2A66' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', background: page === p ? '#0A2A66' : '#fff', color: page === p ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontWeight: page === p ? 700 : 400, fontSize: '13px' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Next</button>
            </div>
          </div>
        </div>

        {/* DRC Policy */}
        <div className="card" style={{ marginTop: '16px', background: '#F8FAFC' }}>
          <div className="card-body" style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                DRC Policy Guidelines
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Minutes of the Doctoral Committee must be uploaded within 48 hours of the meeting's conclusion. Ensure all signatures from external members are collected digitally or scanned as a single PDF. Failure to submit on time may delay scholar stipend approval.
              </div>
            </div>
            <div style={{ width: '280px', background: 'linear-gradient(135deg,#061B44,#0A2A66)', borderRadius: 'var(--radius-md)', padding: '18px', color: '#fff' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>Calendar Sync Active</div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '12px' }}>Your DRC schedule is automatically synced with your Institutional Outlook and Google Calendar.</div>
              <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Manage Sync
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
