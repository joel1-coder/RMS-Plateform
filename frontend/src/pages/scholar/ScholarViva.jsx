export default function ScholarViva() {
  const vivaScheduled = true
  const vivaDetails = {
    date: 'November 12, 2024',
    time: '10:00 AM – 01:00 PM',
    venue: 'Seminar Hall A, Block 3',
    mode: 'Offline',
    chairman: 'Prof. R. Iyer (IIT Madras)',
    examiner1: 'Dr. A. Sharma (External)',
    examiner2: 'Dr. K. Das (Internal)',
    supervisor: 'Dr. Priya Kumar',
    status: 'Scheduled',
  }

  const GUIDELINES = [
    'Prepare a 20-minute presentation covering your entire research.',
    'Print 5 copies of your thesis — one for each panel member.',
    'Bring original documents: registration card, ID proof.',
    'Dress formally; report 30 minutes before the scheduled time.',
    'You will be given time for Q&A (approx. 45 minutes).',
    'Results will be communicated within 7 working days.',
  ]

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Viva Voce</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Your final doctoral examination details</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm">📄 Download Hall Ticket</button>
        </div>
      </div>

      <div className="page-body">
        {vivaScheduled ? (
          <>
            {/* Viva Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #312E81, #4F46E5, #6C63FF)',
              borderRadius: 'var(--radius-xl)', padding: '36px', color: '#fff', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap',
            }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>🎓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Your Viva Voce is Scheduled</div>
                <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>{vivaDetails.date}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{vivaDetails.time} · {vivaDetails.venue}</div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>🗓️ Add to Calendar</button>
                  <button className="btn" style={{ background: '#fff', color: '#4F46E5', fontWeight: 700 }}>📄 Hall Ticket</button>
                </div>
              </div>
              {/* Countdown */}
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: '20px 28px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Days Remaining</div>
                <div style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1, color: '#A5F3FC' }}>117</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>days</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Exam Panel */}
              <div className="card">
                <div className="card-header"><div className="card-title">Examination Panel</div></div>
                <div className="card-body">
                  {[
                    { role: 'Chairman (External)', name: vivaDetails.chairman, icon: '👨‍⚖️', badge: 'External' },
                    { role: 'External Examiner', name: vivaDetails.examiner1, icon: '🎓', badge: 'External' },
                    { role: 'Internal Examiner', name: vivaDetails.examiner2, icon: '🏛️', badge: 'Internal' },
                    { role: 'Supervisor', name: vivaDetails.supervisor, icon: '👨‍🏫', badge: 'Supervisor' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{p.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.role}</div>
                      </div>
                      <span className={`badge ${p.badge === 'External' ? 'badge-warning' : p.badge === 'Internal' ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '10px' }}>{p.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venue Details */}
              <div className="card">
                <div className="card-header"><div className="card-title">Exam Details</div></div>
                <div className="card-body">
                  {[
                    { label: 'Date', value: vivaDetails.date, icon: '📅' },
                    { label: 'Time', value: vivaDetails.time, icon: '⏰' },
                    { label: 'Venue', value: vivaDetails.venue, icon: '🏛️' },
                    { label: 'Mode', value: vivaDetails.mode, icon: '📡' },
                    { label: 'Status', value: vivaDetails.status, icon: '✅' },
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{f.icon}</span>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{f.label}</div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="card">
              <div className="card-header"><div className="card-title">📋 Viva Voce Guidelines</div></div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {GUIDELINES.map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px 14px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', alignItems: 'flex-start' }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#6C63FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>{i + 1}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ paddingTop: '100px' }}>
            <div className="empty-icon">🎓</div>
            <h3>Viva Not Yet Scheduled</h3>
            <p>Your viva voce will be scheduled after thesis submission and DRC approval.</p>
          </div>
        )}
      </div>
    </div>
  )
}
