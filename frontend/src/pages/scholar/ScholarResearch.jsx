import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../utils/api'
import toast from 'react-hot-toast'

export default function ScholarResearch() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [project, setProject] = useState(null)
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const [resProj, resPubs] = await Promise.all([
        apiFetch('/api/research', { headers: { 'Authorization': `Bearer ${token}` } }),
        apiFetch('/api/publication', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      if (resProj.ok) {
        const data = await resProj.json()
        if (Array.isArray(data) && data.length > 0) {
          setProject(data[0])
        }
      }

      if (resPubs.ok) {
        const pubsData = await resPubs.json()
        setPublications(pubsData)
      }
    } catch (err) {
      console.error('Failed to load research data', err)
      toast.error('Failed to load research project')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const topicTitle = project?.topic || user?.profile?.area || 'Artificial Intelligence in Healthcare Diagnostics'
  const supervisorName = project?.supervisor || user?.assignedSupervisor || '-'
  const coSupervisorName = project?.coSupervisor || user?.profile?.coSupervisor || '-'
  const domainName = project?.domain || (user?.dept ? `${user.dept} / Research` : 'AI / Healthcare')
  const overallProgress = project?.progress !== undefined ? project.progress : 68

  const researchPhases = [
    { phase: 'Course Work', pct: overallProgress >= 20 ? 100 : overallProgress * 5, color: '#10B981' },
    { phase: 'Synopsis Preparation', pct: overallProgress >= 40 ? 100 : overallProgress >= 20 ? Math.round((overallProgress - 20) * 5) : 0, color: '#10B981' },
    { phase: 'Literature Review', pct: overallProgress >= 60 ? 100 : overallProgress >= 40 ? Math.round((overallProgress - 40) * 5) : 0, color: '#10B981' },
    { phase: 'Data Collection & Experimentation', pct: overallProgress >= 80 ? 100 : overallProgress >= 60 ? Math.round((overallProgress - 60) * 5) : 0, color: '#6C63FF' },
    { phase: 'Thesis Writing', pct: overallProgress >= 100 ? 100 : overallProgress >= 80 ? Math.round((overallProgress - 80) * 5) : 0, color: '#3B82F6' },
    { phase: 'Final Submission & Viva Voce', pct: overallProgress === 100 ? 100 : 0, color: '#E2E8F0' },
  ]

  const objectives = project?.objectives && project.objectives.length > 0 ? project.objectives : [
    'Develop an innovative methodological framework for the current research domain.',
    'Formulate comparative benchmark evaluations against state-of-the-art architectures.',
    'Perform rigorous empirical validation on domain-specific datasets.',
    'Deploy modular implementation prototypes and document reproducible results.',
    'Publish peer-reviewed findings in high-impact indexed international journals (SCI/Scopus).'
  ]

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">My Research</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track your research topic, progress, and updates</span>
        </div>
      </div>

      <div className="page-body">
        {/* Topic Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          color: '#fff',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Research Topic</div>
            <div style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.3, maxWidth: '600px', marginBottom: '12px' }}>
              {topicTitle}
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { label: 'Supervisor', value: supervisorName },
                { label: 'Co-Supervisor', value: coSupervisorName },
                { label: 'Domain', value: domainName },
              ].map((f, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', padding: '6px 14px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', display: 'block' }}>{f.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{overallProgress}%</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Overall Progress</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['overview', 'phases', 'publications', 'keywords'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              style={tab === t ? { background: 'linear-gradient(90deg,#10B981,#059669)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' } : {}}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <div className="card-header"><div className="card-title">Research Objectives</div></div>
              <div className="card-body">
                <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {objectives.map((obj, i) => (
                    <li key={i} style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{obj}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">Research Overview Details</div></div>
              <div className="card-body">
                {[
                  { label: 'Scholar Name', value: user?.name || '-' },
                  { label: 'Registration No.', value: user?.profile?.regNo || 'PhD/2021/CS/042' },
                  { label: 'Department', value: user?.dept || '-' },
                  { label: 'Current Stage', value: project?.stage || 'Course Work' },
                  { label: 'Project Status', value: project?.status || 'Active' },
                  { label: 'Enrolled Date', value: project?.startDate || user?.joined || '-' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'phases' && (
          <div className="card">
            <div className="card-header"><div className="card-title">Research Phases & Milestones</div></div>
            <div className="card-body">
              {researchPhases.map((p, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600 }}>{p.phase}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: p.pct === 0 ? 'var(--text-muted)' : '#10B981' }}>{p.pct}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ width: `${p.pct}%`, background: p.pct === 100 ? '#10B981' : '#6C63FF' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'publications' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">My Publications ({publications.length})</div>
            </div>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              {publications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📰</div>
                  <div>No publications recorded in database yet.</div>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th><th>Title</th><th>Journal / Venue</th><th>Type</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publications.map((p, i) => (
                      <tr key={p.id || p._id || i}>
                        <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                        <td style={{ fontWeight: 600, fontSize: '13px' }}>{p.title}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{p.journal}</td>
                        <td><span className="badge badge-info" style={{ fontSize: '11px' }}>{p.pubType || 'Journal'}</span></td>
                        <td><span className={`badge ${p.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                        <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'keywords' && (
          <div className="card card-body">
            <div className="card-title" style={{ marginBottom: '16px' }}>Research Domain Keywords</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Deep Learning', 'Neural Networks', 'Artificial Intelligence', 'Computational Methods', 'Pattern Recognition', 'Data Analysis', 'Model Validation', 'System Architecture'].map((kw, i) => (
                <span key={i} style={{ padding: '7px 14px', borderRadius: 'var(--radius-full)', background: i % 3 === 0 ? '#EDE9FE' : i % 3 === 1 ? '#D1FAE5' : '#DBEAFE', color: i % 3 === 0 ? '#6C63FF' : i % 3 === 1 ? '#059669' : '#1D4ED8', fontSize: '13px', fontWeight: 600 }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
