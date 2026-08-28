import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../utils/api'
import toast from 'react-hot-toast'

const COLOR_PALETTE = ['#174EA6', '#1E7D45', '#C89B1E', '#B4232A', '#6B1F2A', '#0A2A66', '#4C6B58']

const lineData = [
  { year: '2021', rate: 76 },
  { year: '2022', rate: 82 },
  { year: '2023', rate: 88 },
  { year: '2024', rate: 91 },
  { year: '2025', rate: 94.2 },
]

export default function HODReports() {
  const { user } = useAuth()
  const [scholars, setScholars] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartMode, setChartMode] = useState('Annual')

  useEffect(() => {
    fetchReportsData()
  }, [user?.dept])

  const fetchReportsData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('rms_token')
      const deptFilter = user?.dept && user.dept !== 'All' ? `&dept=${user.dept}` : ''
      const res = await apiFetch(`/api/users?role=scholar${deptFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load reports data')
      const data = await res.json()
      setScholars(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load department report data')
    } finally {
      setLoading(false)
    }
  }

  // Dynamic pie chart generation based on research area breakdown
  const pieData = useMemo(() => {
    if (!scholars.length) {
      return [{ name: 'No Scholars', value: 1, color: '#E5E7EB' }]
    }
    const counts = {}
    scholars.forEach(s => {
      const area = s.profile?.area || s.area || 'General Research'
      counts[area] = (counts[area] || 0) + 1
    })

    const keys = Object.keys(counts)
    return keys.map((key, index) => {
      const pct = Math.round((counts[key] / scholars.length) * 100)
      return {
        name: `${key} (${pct}%)`,
        value: counts[key],
        color: COLOR_PALETTE[index % COLOR_PALETTE.length]
      }
    })
  }, [scholars])

  const activeCount = scholars.filter(s => s.status === 'Active').length
  const completedCount = scholars.filter(s => s.status === 'Completed').length
  const pendingCount = scholars.filter(s => !s.assignedSupervisorId).length

  const bottomKPIs = [
    { label: 'Total Scholars', value: scholars.length, sub: 'In Department', icon: '🎓', bg: '#F3F7FF', color: '#0A2A66' },
    { label: 'Active Research', value: activeCount, sub: 'In Progress', icon: '⚡', bg: '#E7F4EC', color: '#166A3A' },
    { label: 'Pending Assignment', value: pendingCount, sub: 'Requires Supervisor', icon: '⏳', bg: '#FFF6D8', color: '#936C00' },
  ]

  const handleExportExcel = () => {
    if (!scholars.length) return toast.error('No scholar data to export')
    const headers = ['Reg No', 'Scholar Name', 'Email', 'Department', 'Status', 'Supervisor', 'Research Area']
    const rows = scholars.map(s => [
      s.profile?.regNo || s._id || '-',
      s.name,
      s.email,
      s.dept || user?.dept || 'Unknown',
      s.status || 'Active',
      s.assignedSupervisor || 'Unassigned',
      s.profile?.area || 'N/A'
    ])
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(cell => `"${cell}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Department_Scholars_Report_${user?.dept || 'All'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Excel/CSV Report downloaded successfully!')
  }

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return toast.error('Please allow popups to generate PDF')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Departmental Research Report - ${user?.dept || 'All Departments'}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 30px; line-height: 1.5; color: #222; }
          h1 { color: #174EA6; text-align: center; font-size: 18pt; margin-bottom: 4px; }
          h3 { text-align: center; color: #555; font-size: 11pt; margin-bottom: 24px; font-weight: normal; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px 10px; font-size: 10pt; text-align: left; }
          th { background-color: #174EA6; color: white; text-transform: uppercase; font-size: 9pt; }
          .kpi-container { display: flex; justify-content: space-between; margin-bottom: 24px; }
          .kpi-box { width: 30%; border: 1px solid #174EA6; padding: 12px; text-align: center; border-radius: 6px; }
          .kpi-num { font-size: 18pt; font-weight: bold; color: #174EA6; }
          .kpi-lbl { font-size: 9pt; color: #555; text-transform: uppercase; }
        </style>
      </head>
      <body onload="window.print();">
        <h1>Research Management System - Departmental Report</h1>
        <h3>Department of ${user?.dept || 'All Departments'} &nbsp;|&nbsp; Generated on: ${new Date().toLocaleDateString()}</h3>
        
        <div class="kpi-container">
          <div class="kpi-box"><div class="kpi-num">${scholars.length}</div><div class="kpi-lbl">Total Scholars</div></div>
          <div class="kpi-box"><div class="kpi-num">${activeCount}</div><div class="kpi-lbl">Active Research</div></div>
          <div class="kpi-box"><div class="kpi-num">${completedCount}</div><div class="kpi-lbl">Completed</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Scholar Name</th>
              <th>Status</th>
              <th>Supervisor Name</th>
              <th>Research Area</th>
            </tr>
          </thead>
          <tbody>
            ${scholars.map(s => `
              <tr>
                <td>${s.profile?.regNo || s._id?.slice(-6) || '-'}</td>
                <td><strong>${s.name}</strong><br/><span style="color:#666;font-size:8pt;">${s.email}</span></td>
                <td>${s.status || 'Active'}</td>
                <td>${s.assignedSupervisor || 'Unassigned'}</td>
                <td>${s.profile?.area || 'General Research'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" style={{ borderColor: 'rgba(23,78,166,0.18)', borderTopColor: '#174EA6' }} />
    </div>
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div style={{ fontWeight: 800, fontSize: '18px' }}>Departmental Research Reports</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time analytics and research distribution overview for {user?.dept || 'Department'}</div>
        </div>
        <div className="topbar-actions">
          <button onClick={handleExportExcel} className="btn btn-ghost btn-sm">📊 Export Excel</button>
          <button onClick={handleDownloadPDF} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }}>📄 Download PDF</button>
        </div>
      </div>

      <div className="page-body">
        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', marginBottom: '20px' }}>
          {/* Pie chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Scholars by Research Area</div>
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
                  <div style={{ fontSize: '26px', fontWeight: 800 }}>{scholars.length}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
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
            <div style={{ padding: '0 16px 16px', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '-4px' }}>Historical progression over recent batches</div>
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
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Showing {scholars.length} scholars in {user?.dept || 'All'} Department </span>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Status</th>
                  <th>Supervisor Name</th>
                  <th>Research Area</th>
                </tr>
              </thead>
              <tbody>
                {scholars.map((s, i) => (
                  <tr key={s._id || i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#174EA6' }}>{s.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.profile?.regNo || s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'Completed' ? 'badge-info' : s.status === 'Inactive' ? 'badge-danger' : 'badge-success'}`}>
                        {s.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: 600 }}>{s.assignedSupervisor || 'Unassigned'}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{s.profile?.area || 'General Research'}</td>
                  </tr>
                ))}
                {scholars.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No scholars found for this department.
                    </td>
                  </tr>
                )}
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

