import { apiFetch } from '../../utils/api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const REPORT_TYPES = ['Scholar Progress', 'Thesis Summary', 'Viva Statistics', 'Department Report', 'Synopsis Report']

function getDaysElapsed(dateStr) {
  const start = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

function getYears(dateStr) {
  const days = getDaysElapsed(dateStr)
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  return { years, months, days }
}

export default function Reports() {
  const [reportType, setReportType] = useState('Scholar Progress')
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState('2024-07-31')
  const [department, setDepartment] = useState('All Departments')
  const [generated, setGenerated] = useState(false)

  // Scholar lookup
  const [scholarName, setScholarName] = useState('')
  const [scholarResult, setScholarResult] = useState(null)
  const [scholarSearched, setScholarSearched] = useState(false)

  const [research, setResearch] = useState([])
  const [dashboardData, setDashboardData] = useState({ monthlyData: [] })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const [res1, res2] = await Promise.all([
        apiFetch('/api/research', { headers: { 'Authorization': `Bearer ${token}` } }),
        apiFetch('/api/reports/admin-dashboard', { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      
      if (res1.ok) setResearch(await res1.json())
      if (res2.ok) setDashboardData(await res2.json())
    } catch {
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalReports = research.length;
  const completedReports = research.filter(r => r.status === 'Completed').length;
  const completionRate = totalReports ? Math.round((completedReports / totalReports) * 100) : 0;
  
  let totalDays = 0;
  research.forEach(r => totalDays += getDaysElapsed(r.startDate));
  const avgDurationYrs = totalReports ? (totalDays / totalReports / 365).toFixed(1) : 0;
  
  const activeReports = research.filter(r => r.status === 'Active').length;
  const successRate = totalReports ? Math.round(((activeReports + completedReports) / totalReports) * 100) : 0;

  const handleGenerate = () => {
    setGenerated(true)
    toast.success(`${reportType} report generated!`)
  }

  const handleExportPDF = () => toast.success('PDF exported successfully!')
  const handleExportExcel = () => toast.success('Excel exported successfully!')

  const handleScholarSearch = () => {
    if (!scholarName.trim()) { toast.error('Please enter a scholar name'); return }
    const found = research.find(r => r.scholar?.toLowerCase().includes(scholarName.toLowerCase()))
    if (found) {
      setScholarResult(found)
      setScholarSearched(true)
    } else {
      toast.error(`No scholar found matching "${scholarName}"`)
      setScholarResult(null)
      setScholarSearched(true)
    }
  }

  const handleGenerateScholarReport = () => {
    if (!scholarResult) return
    toast.success(`Individual progress report generated for ${scholarResult.scholar}!`)
  }

  const { years, months } = scholarResult ? getYears(scholarResult.startDate) : {}

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Reports & Analytics</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Generate and export research data reports</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleExportPDF}> Export PDF</button>
          <button className="btn btn-success btn-sm" onClick={handleExportExcel}> Export Excel</button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
          {[
            { label: 'Total Projects', value: totalReports.toString(), icon: '', color: 'blue' },
            { label: 'Completion Rate', value: `${completionRate}%`, icon: '', color: 'green' },
            { label: 'Avg. PhD Duration', value: `${avgDurationYrs} yr`, icon: '', color: 'blue' },
            { label: 'Success Rate', value: `${successRate}%`, icon: '', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scholar Name Lookup Card */}
        <div className="card" style={{ marginBottom: '20px', border: '2px solid #F3F7FF' }}>
          <div className="card-header" style={{ background: 'linear-gradient(90deg, #F3F7FF, #E8EEF8)' }}>
            <div>
              <div className="card-title"> Scholar Progress Lookup</div>
              <div className="card-subtitle">Enter a scholar name to view their complete research history and generate a report</div>
            </div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Enter Scholar Name</label>
                <input
                  className="form-control"
                  placeholder="e.g. Rahul Sharma, Neha Patel..."
                  value={scholarName}
                  onChange={e => setScholarName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScholarSearch()}
                  style={{ fontSize: '14px' }}
                />
              </div>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)', whiteSpace: 'nowrap' }} onClick={handleScholarSearch}>
                 Search Scholar
              </button>
            </div>

            {scholarSearched && !scholarResult && (
              <div style={{ padding: '16px', background: '#F9E6E8', borderRadius: 'var(--radius-md)', color: '#B4232A', fontWeight: 600, textAlign: 'center' }}>
                 No scholar found matching "{scholarName}". Check the name or add this scholar in Research Management.
              </div>
            )}

            {scholarResult && (
              <div style={{ border: '1.5px solid #B9C9EA', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {/* Scholar header */}
                <div style={{ background: 'linear-gradient(135deg, #0A2A66, #061B44)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="avatar" style={{ background: 'linear-gradient(135deg,#174EA6,#0A2A66)', width: 50, height: 50, fontSize: 20 }}>
                      {scholarResult.scholar?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>{scholarResult.scholar}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{scholarResult.dept} - {scholarResult.supervisor}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ background: '#1E7D45', border: 'none' }} onClick={handleGenerateScholarReport}>
                     Generate Report
                  </button>
                </div>

                {/* Scholar details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#E2E8F0' }}>
                  {[
                    { label: 'Research Duration', value: `${years}y ${months}m`, icon: '', bg: '#E7F4EC', color: '#166A3A' },
                    { label: 'Current Stage', value: scholarResult.stage, icon: '', bg: '#F3F7FF', color: '#0A2A66' },
                    { label: 'Progress', value: `${scholarResult.progress}%`, icon: '', bg: '#FFF7ED', color: '#C2410C' },
                    { label: 'Status', value: scholarResult.status, icon: '', bg: scholarResult.status === 'Active' ? '#E7F4EC' : '#F9E6E8', color: scholarResult.status === 'Active' ? '#166A3A' : '#B4232A' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: item.bg, padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Research topic */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Research Topic</label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                    {scholarResult.topic}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                     Enrolled: {scholarResult.startDate} - Supervisor: {scholarResult.supervisor}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Overall Completion Level</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#174EA6' }}>{scholarResult.progress}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '10px' }}>
                    <div className="progress-fill" style={{
                      width: `${scholarResult.progress}%`,
                      background: scholarResult.progress === 100 ? '#1E7D45' : scholarResult.progress >= 60 ? '#174EA6' : '#C89B1E',
                      borderRadius: '99px', transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="filter-bar">
            <div>
              <label className="form-label" style={{ marginBottom: '4px' }}>Report Type</label>
              <select className="form-control form-select" style={{ width: '220px' }} value={reportType} onChange={e => setReportType(e.target.value)}>
                {REPORT_TYPES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: '4px' }}>From Date</label>
              <input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: '160px' }} />
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: '4px' }}>To Date</label>
              <input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: '160px' }} />
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: '4px' }}>Department</label>
              <select className="form-control form-select" style={{ width: '180px' }} value={department} onChange={e => setDepartment(e.target.value)}>
                {['All Departments', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }} onClick={handleGenerate}>
                 Generate
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Thesis Submission Trends</div>
                <div className="card-subtitle">Monthly submitted / approved / rejected</div>
              </div>
            </div>
            <div className="card-body" style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="submitted" fill="#174EA6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="approved" fill="#1E7D45" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rejected" fill="#B4232A" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Scholar Progress</div>
                <div className="card-subtitle">Active vs Completed vs Discontinued</div>
              </div>
            </div>
            <div className="card-body" style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="active" stroke="#174EA6" fill="#E8EEF8" strokeWidth={2} />
                  <Area type="monotone" dataKey="completed" stroke="#1E7D45" fill="#E7F4EC" strokeWidth={2} />
                  <Area type="monotone" dataKey="discontinued" stroke="#B4232A" fill="#F9E6E8" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Research table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">All Research Projects</div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{research.length} total entries</span>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading analytical metrics...</div>
            ) : research.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No research projects registered</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Scholar</th>
                    <th>Research Topic</th>
                    <th>Supervisor</th>
                    <th>Start Date</th>
                    <th>Stage</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {research.map(r => (
                    <tr key={r.id || r._id}>
                      <td style={{ fontWeight: 600, fontSize: '13px' }}>{r.scholar} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({r.dept})</span></td>
                      <td style={{ fontSize: '12px', maxWidth: '200px' }}>{r.topic}</td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{r.supervisor}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.startDate}</td>
                      <td><span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: '#F1F5F9', color: '#475569' }}>{r.stage}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div className="progress-bar" style={{ width: '80px' }}>
                            <div className="progress-fill" style={{ width: `${r.progress}%`, background: r.progress === 100 ? '#1E7D45' : '#174EA6' }} />
                          </div>
                          <span style={{ fontSize: '11.5px', fontWeight: 700 }}>{r.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${r.status === 'Active' ? 'badge-success' : r.status === 'Completed' ? 'badge-info' : 'badge-danger'}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
