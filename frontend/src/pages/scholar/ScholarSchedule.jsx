import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const events = [
  { id: 1, title: 'Supervisor Meeting',         day: 'Mon', time: '10:00 AM', duration: '1 hr',  type: 'meeting',  color: '#174EA6' },
  { id: 2, title: 'Lab Work / Experiments',     day: 'Tue', time: '09:00 AM', duration: '3 hrs', type: 'research', color: '#1E7D45' },
  { id: 3, title: 'Literature Review Session',  day: 'Wed', time: '02:00 PM', duration: '2 hrs', type: 'research', color: '#1E7D45' },
  { id: 4, title: 'DRC Progress Presentation',  day: 'Thu', time: '11:00 AM', duration: '1 hr',  type: 'drc',      color: '#C89B1E' },
  { id: 5, title: 'Thesis Writing - Chapter 5', day: 'Fri', time: '09:00 AM', duration: '4 hrs', type: 'writing',  color: '#174EA6' },
  { id: 6, title: 'Paper Review (Co-author)',   day: 'Sat', time: '10:00 AM', duration: '2 hrs', type: 'research', color: '#1E7D45' },
]

const upcomingEvents = [
  { title: 'Chapter 4 Submission to Supervisor', date: 'Aug 5, 2024',  urgent: true,  icon: '' },
  { title: 'DRC Progress Review Meeting',         date: 'Jul 25, 2024', urgent: true,  icon: '' },
  { title: 'IJCA Paper Review Deadline',          date: 'Aug 15, 2024', urgent: false, icon: '' },
  { title: 'Progress Report Submission',           date: 'Aug 31, 2024', urgent: false, icon: '' },
  { title: 'Final Thesis Submission',             date: 'Sep 30, 2024', urgent: false, icon: '' },
  { title: 'Viva Voce (Tentative)',               date: 'Nov 12, 2024', urgent: false, icon: '' },
]

const TYPE_ICON = { meeting: '', research: '', drc: '', writing: '' }

export default function ScholarSchedule() {
  const [view, setView] = useState('week')

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">My Schedule</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage your research timetable and upcoming events</span>
        </div>
        <div className="topbar-actions">
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
            {['week', 'month', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '5px 14px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#1E7D45,#166A3A)' }}>+ Add Event</button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
          {/* Calendar / Week View */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Week View - July 2024</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-ghost btn-sm"> Prev</button>
                <button className="btn btn-ghost btn-sm">Today</button>
                <button className="btn btn-ghost btn-sm">Next </button>
              </div>
            </div>
            <div style={{ overflow: 'auto' }}>
              {/* Day columns */}
              <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(7, 1fr)`, minWidth: '700px' }}>
                {/* Header row */}
                <div style={{ padding: '12px', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }} />
                {DAYS.map((day, i) => {
                  const dates = [22, 23, 24, 25, 26, 27, 28]
                  const isToday = i === 1
                  return (
                    <div key={day} style={{
                      padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)',
                      background: isToday ? '#F3F7FF' : 'transparent',
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{day}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: isToday ? 'var(--primary)' : 'var(--text-primary)', marginTop: '2px' }}>{dates[i]}</div>
                    </div>
                  )
                })}

                {/* Time slots */}
                {['09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM', '03 PM', '04 PM'].map(time => (
                  <>
                    <div key={`t-${time}`} style={{ padding: '10px 8px', borderBottom: '1px solid #F1F5F9', borderRight: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
                      {time}
                    </div>
                    {DAYS.map(day => {
                      const ev = events.find(e => e.day === day && e.time.startsWith(time.replace(' ', '')))
                      return (
                        <div key={`${day}-${time}`} style={{ padding: '3px', borderBottom: '1px solid #F1F5F9', borderRight: '1px solid var(--border)', minHeight: '44px', background: day === 'Tue' ? '#FAFBFF' : 'transparent', position: 'relative' }}>
                          {ev && (
                            <div style={{
                              background: ev.color, color: '#fff', borderRadius: 'var(--radius-sm)', padding: '4px 7px',
                              fontSize: '11px', fontWeight: 600, lineHeight: 1.3, cursor: 'pointer',
                              boxShadow: `0 2px 8px ${ev.color}40`,
                            }}>
                              {TYPE_ICON[ev.type]} {ev.title}
                              <div style={{ fontSize: '10px', opacity: 0.8 }}>{ev.time} - {ev.duration}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Legend */}
            <div className="card card-body">
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>Event Types</div>
              {[
                { color: '#174EA6', label: 'Supervisor Meeting' },
                { color: '#1E7D45', label: 'Research / Lab' },
                { color: '#C89B1E', label: 'DRC / Committee' },
                { color: '#174EA6', label: 'Thesis Writing' },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '3px', background: l.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <div className="card-header"><div className="card-title">Upcoming Events</div></div>
              <div style={{ padding: '0 16px 12px' }}>
                {upcomingEvents.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < upcomingEvents.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{ev.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{ev.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{ev.date}</div>
                    </div>
                    {ev.urgent && <span className="badge badge-danger" style={{ fontSize: '10px' }}>!</span>}
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
