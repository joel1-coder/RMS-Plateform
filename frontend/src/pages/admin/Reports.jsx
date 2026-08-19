import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const monthlyProgress = [
  { month: 'Jan', submitted: 4, approved: 3, rejected: 1 },
  { month: 'Feb', submitted: 6, approved: 5, rejected: 1 },
  { month: 'Mar', submitted: 5, approved: 4, rejected: 1 },
  { month: 'Apr', submitted: 8, approved: 7, rejected: 1 },
  { month: 'May', submitted: 7, approved: 5, rejected: 2 },
  { month: 'Jun', submitted: 10, approved: 8, rejected: 2 },
  { month: 'Jul', submitted: 12, approved: 9, rejected: 3 },
]

const scholarProgress = [
  { month: 'Jan', active: 85, completed: 12, discontinued: 3 },
  { month: 'Feb', active: 88, completed: 15, discontinued: 3 },
  { month: 'Mar', active: 92, completed: 18, discontinued: 4 },
  { month: 'Apr', active: 96, completed: 22, discontinued: 4 },
  { month: 'May', active: 98, completed: 25, discontinued: 5 },
  { month: 'Jun', active: 102, completed: 28, discontinued: 5 },
  { month: 'Jul', active: 108, completed: 32, discontinued: 6 },
]

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
  const [loading, setLoading] = useState(true)

  const fetchResearch = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await fetch('/api/research', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setResearch(data)
    } catch {
      toast.error('Failed to load research project analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResearch()
  }, [])

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
          <button className="btn btn-ghost btn-sm" onClick={handleExportPDF}>📥 Export PDF</button>
          <button className="btn btn-success btn-sm" onClick={handleExportExcel}>📊 Export Excel</button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
          {[
            { label: 'Reports Generated', value: '124', icon: '📊', color: 'purple' },
            { label: 'Completion Rate', value: '87%', icon: '✅', color: 'green' },
            { label: 'Avg. PhD Duration', value: '4.2 yr', icon: '📅', color: 'blue' },
            { label: 'Success Rate', value: '92%', icon: '🎓', color: 'orange' },
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
        <div className="card" style={{ marginBottom: '20px', border: '2px solid #EFF6FF' }}>
          <div className="card-header" style={{ background: 'linear-gradient(90deg, #EFF6FF, #DBEAFE)' }}>
            <div>
              <div className="card-title">🎓 Scholar Progress Lookup</div>
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
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)', whiteSpace: 'nowrap' }} onClick={handleScholarSearch}>
                🔍 Search Scholar
              </button>
            </div>

            {scholarSearched && !scholarResult && (
              <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: 'var(--radius-md)', color: '#EF4444', fontWeight: 600, textAlign: 'center' }}>
                ❌ No scholar found matching "{scholarName}". Check the name or add this scholar in Research Management.
              </div>
            )}

            {scholarResult && (
              <div style={{ border: '1.5px solid #BFDBFE', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {/* Scholar header */}
                <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #0F172A)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="avatar" style={{ background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', width: 50, height: 50, fontSize: 20 }}>
                      {scholarResult.scholar?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>{scholarResult.scholar}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{scholarResult.dept} · {scholarResult.supervisor}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ background: '#10B981', border: 'none' }} onClick={handleGenerateScholarReport}>
                    📄 Generate Report
                  </button>
                </div>

                {/* Scholar details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#E2E8F0' }}>
                  {[
                    { label: 'Research Duration', value: `${years}y ${months}m`, icon: '📅', bg: '#F0FDF4', color: '#15803D' },
                    { label: 'Current Stage', value: scholarResult.stage, icon: '🔬', bg: '#EFF6FF', color: '#1D4ED8' },
                    { label: 'Progress', value: `${scholarResult.progress}%`, icon: '📈', bg: '#FFF7ED', color: '#C2410C' },
                    { label: 'Status', value: scholarResult.status, icon: '🟢', bg: scholarResult.status === 'Active' ? '#F0FDF4' : '#FEF2F2', color: scholarResult.status === 'Active' ? '#15803D' : '#EF4444' },
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
                    📅 Enrolled: {scholarResult.startDate} · Supervisor: {scholarResult.supervisor}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Overall Completion Level</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#6C63FF' }}>{scholarResult.progress}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '10px' }}>
                    <div className="progress-fill" style={{
                      width: `${scholarResult.progress}%`,
                      background: scholarResult.progress === 100 ? '#10B981' : scholarResult.progress >= 60 ? '#3B82F6' : '#F59E0B',
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
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={handleGenerate}>
                🔄 Generate
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
                <BarChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="submitted" fill="#6C63FF" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="approved" fill="#10B981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rejected" fill="#EF4444" radius={[3, 3, 0, 0]} />
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
                <AreaChart data={scholarProgress}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="active" stroke="#6C63FF" fill="#EDE9FE" strokeWidth={2} />
                  <Area type="monotone" dataKey="completed" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} />
                  <Area type="monotone" dataKey="discontinued" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} />
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
                            <div className="progress-fill" style={{ width: `${r.progress}%`, background: r.progress === 100 ? '#10B981' : '#6C63FF' }} />
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
