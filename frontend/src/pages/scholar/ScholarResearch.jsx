import { useState } from 'react'

const updates = [
  { date: 'Jul 10, 2024', title: 'Completed Chapter 4 draft', desc: 'Finished writing the experimental results and analysis section. 42 pages.', approved: true },
  { date: 'Jun 15, 2024', title: 'Data analysis completed', desc: 'All datasets processed. Running ML model evaluations. Accuracy: 94.2%', approved: true },
  { date: 'May 20, 2024', title: 'Dataset collection done', desc: 'Collected 15,000+ records from 3 hospitals. IRB approval obtained.', approved: true },
  { date: 'Mar 10, 2024', title: 'Literature review submitted', desc: 'Reviewed 120+ papers. Submitted survey paper to supervisor for review.', approved: false },
]

const publications = [
  { title: 'Deep Learning for Medical Image Classification', journal: 'IEEE Access', year: 2023, status: 'Published', type: 'Journal' },
  { title: 'AI-Driven Diagnostics: A Survey', journal: 'IJCA', year: 2023, status: 'Published', type: 'Conference' },
  { title: 'Federated Learning in Healthcare', journal: 'Springer LNCS', year: 2024, status: 'Under Review', type: 'Journal' },
]

export default function ScholarResearch() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">My Research</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track your research topic, progress, and updates</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }}>＋ Add Update</button>
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
              Artificial Intelligence in Healthcare Diagnostics:<br />A Deep Learning Approach
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { label: 'Supervisor', value: 'Dr. Priya Kumar' },
                { label: 'Co-Supervisor', value: 'Dr. S. Iyer' },
                { label: 'Domain', value: 'AI / Healthcare' },
              ].map((f, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', padding: '6px 14px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', display: 'block' }}>{f.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>68%</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Overall Progress</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['overview', 'updates', 'publications', 'keywords'].map(t => (
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
                  {[
                    'Develop a deep learning model for early disease detection from medical images',
                    'Compare performance of CNN, ResNet, and Vision Transformer architectures',
                    'Achieve >95% accuracy on benchmark datasets (NIH ChestX-ray)',
                    'Deploy a real-time diagnostic web application prototype',
                    'Publish findings in high-impact journals (SCI-indexed)',
                  ].map((obj, i) => (
                    <li key={i} style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{obj}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">Research Phases</div></div>
              <div className="card-body">
                {[
                  { phase: 'Course Work',          pct: 100, color: '#10B981' },
                  { phase: 'Literature Review',    pct: 100, color: '#10B981' },
                  { phase: 'Data Collection',      pct: 100, color: '#10B981' },
                  { phase: 'Experimentation',      pct: 85,  color: '#6C63FF' },
                  { phase: 'Thesis Writing',       pct: 55,  color: '#3B82F6' },
                  { phase: 'Final Submission',     pct: 0,   color: '#E2E8F0' },
                ].map((p, i) => (
                  <div key={i} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{p.phase}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: p.color === '#E2E8F0' ? 'var(--text-muted)' : p.color }}>{p.pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'updates' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Research Progress Updates</div>
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }}>＋ Add Update</button>
            </div>
            <div className="card-body">
              <div style={{ position: 'relative', paddingLeft: '28px' }}>
                <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
                {updates.map((u, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: '24px' }}>
                    <div style={{
                      position: 'absolute', left: '-23px', width: '16px', height: '16px',
                      borderRadius: '50%', background: u.approved ? '#10B981' : '#F59E0B',
                      border: '3px solid #fff', boxShadow: '0 0 0 2px ' + (u.approved ? '#10B981' : '#F59E0B'),
                      top: '3px',
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{u.title}</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`badge ${u.approved ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                          {u.approved ? 'Approved' : 'Pending'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.date}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{u.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'publications' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">My Publications</div>
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#10B981,#059669)' }}>＋ Add Publication</button>
            </div>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th><th>Title</th><th>Journal / Conference</th><th>Year</th><th>Type</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {publications.map((p, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, fontSize: '13px' }}>{p.title}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{p.journal}</td>
                      <td>{p.year}</td>
                      <td><span className="badge badge-info" style={{ fontSize: '11px' }}>{p.type}</span></td>
                      <td><span className={`badge ${p.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'keywords' && (
          <div className="card card-body">
            <div className="card-title" style={{ marginBottom: '16px' }}>Research Keywords</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Deep Learning', 'Convolutional Neural Networks', 'Medical Image Analysis', 'Computer Vision', 'Healthcare AI', 'Transfer Learning', 'ResNet', 'Vision Transformer', 'Federated Learning', 'Disease Detection', 'Diagnostic Accuracy', 'Clinical Decision Support', 'Data Augmentation', 'Model Explainability', 'Chest X-Ray'].map((kw, i) => (
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
