import { useState } from 'react'
import toast from 'react-hot-toast'

const unassignedScholars = [
  { id: 'REG-2023-091', name: 'Alex Mercer', area: 'Quantum Computing', tags: ['MACHINE LEARNING', 'EMBEDDED SYSTEMS'], topic: 'Optimization of Superconducting Qubits using AI', color: '#8B5CF6' },
  { id: 'REG-2023-014', name: 'Elena Rodriguez', area: 'Quantum Computing', tags: ['QUANTUM COMPUTING'], topic: 'Find-Short Protocols for Quantum Data', color: '#3B82F6' },
  { id: 'REG-2022-077', name: 'Chen Wei', area: 'Cybersecurity', tags: ['CYBERSECURITY', 'BLOCKCHAIN'], topic: 'Distributed Speciality System in Wei', color: '#EF4444' },
  { id: 'REG-2023-119', name: 'Jordan Smith', area: 'Data Science', tags: ['NLP', 'AI/ML'], topic: 'Transformer Models for Real-time Translation', color: '#10B981' },
]

const facultyPool = [
  { id: 'FAC-001', name: 'Dr. Sarah Jenkins', dept: 'Senior Scientist · Computer Science', available: true, tags: ['MACHINE LEARNING', 'EMBEDDED SYSTEMS'], scholars: 4, maxScholars: 8, color: '#3B82F6' },
  { id: 'FAC-002', name: 'Prof. Liam Vance', dept: 'Lead Researcher · 1 Quarter', available: false, tags: ['QUANTUM COMPUTING'], scholars: 7, maxScholars: 8, color: '#8B5CF6' },
  { id: 'FAC-003', name: 'Dr. Maria Santos', dept: 'Asst. Professor · Information Technology', available: true, tags: ['risk', 'blockchain'], scholars: 2, maxScholars: 5, color: '#10B981' },
]

export default function HODAllocations() {
  const [scholars, setScholars] = useState(unassignedScholars)
  const [faculty, setFaculty] = useState(facultyPool)
  const [selectedScholar, setSelectedScholar] = useState(null)
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleConfirm = () => {
    if (!selectedScholar || !selectedFaculty) { toast.error('Please select both a scholar and a faculty member'); return }
    toast.success(`${selectedScholar.name} assigned to ${selectedFaculty.name}!`)
    setScholars(prev => prev.filter(s => s.id !== selectedScholar.id))
    setFaculty(prev => prev.map(f => f.id === selectedFaculty.id ? { ...f, scholars: f.scholars + 1 } : f))
    setSelectedScholar(null)
    setSelectedFaculty(null)
    setShowConfirmModal(false)
  }

  return (
    <div className="animate-fade">
      {/* Confirm Modal */}
      {showConfirmModal && selectedScholar && selectedFaculty && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <span className="modal-title">Confirm Allocation</span>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                You are about to assign the following scholar to a supervisor:
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ padding: '12px', background: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8', marginBottom: '4px' }}>SCHOLAR</div>
                  <div style={{ fontWeight: 700 }}>{selectedScholar.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedScholar.topic}</div>
                </div>
                <div style={{ padding: '12px', background: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', marginBottom: '4px' }}>FACULTY</div>
                  <div style={{ fontWeight: 700 }}>{selectedFaculty.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedFaculty.dept}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#3B82F6,#1D4ED8)' }} onClick={handleConfirm}>✓ Confirm Allocation</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Supervisor Allocation</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Streamline PhD mentorship by pairing scholars with eligible faculty members.</span>
        </div>
        <div className="topbar-actions">
          <input className="form-control" style={{ width: '220px', fontSize: '12.5px' }} placeholder="Search scholars or supervisors..." />
          <button 
            className="btn btn-primary btn-sm" 
            style={{ background: 'linear-gradient(90deg,#3B82F6,#1D4ED8)' }}
            onClick={() => selectedScholar && selectedFaculty ? setShowConfirmModal(true) : toast.error('Select a scholar and faculty member first')}
          >
            ✓ Confirm Allocation
          </button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Unassigned Scholars */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Unassigned Scholars</div>
              <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
                {scholars.length} Pending
              </span>
            </div>
            <div style={{ padding: '8px 16px 16px' }}>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Select a scholar to assign to a faculty member.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {scholars.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedScholar(prev => prev?.id === s.id ? null : s)}
                    style={{
                      padding: '14px', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s',
                      border: `2px solid ${selectedScholar?.id === s.id ? s.color : 'var(--border)'}`,
                      background: selectedScholar?.id === s.id ? `${s.color}08` : '#F8FAFC',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div className="avatar avatar-sm" style={{ background: s.color }}>{s.name.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{s.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.id}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{s.topic}</div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {s.tags.map(tag => (
                            <span key={tag} style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '99px', background: `${s.color}18`, color: s.color, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {scholars.length === 0 && (
                  <div className="empty-state"><div className="empty-icon">🎉</div><h3>All scholars assigned!</h3><p>No pending allocations.</p></div>
                )}
              </div>
            </div>
          </div>

          {/* Faculty Pool */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Faculty Pool</div>
              <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
                {faculty.filter(f => f.available).length} Available
              </span>
            </div>
            <div style={{ padding: '8px 16px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {faculty.map(f => {
                  const pct = Math.round((f.scholars / f.maxScholars) * 100)
                  const isSelected = selectedFaculty?.id === f.id
                  return (
                    <div
                      key={f.id}
                      onClick={() => f.available && setSelectedFaculty(prev => prev?.id === f.id ? null : f)}
                      style={{
                        padding: '14px', borderRadius: 'var(--radius-md)', transition: 'all 0.2s',
                        border: `2px solid ${isSelected ? f.color : 'var(--border)'}`,
                        background: !f.available ? '#F8FAFC' : isSelected ? `${f.color}08` : '#F8FAFC',
                        cursor: f.available ? 'pointer' : 'not-allowed',
                        opacity: f.available ? 1 : 0.65,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: f.color }}>{f.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{f.name}</span>
                            <span className={`badge ${f.available ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '9px' }}>
                              {f.available ? 'AVAILABLE' : 'NEAR CAPACITY'}
                            </span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{f.dept}</div>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {f.tags.map(tag => (
                              <span key={tag} style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '99px', background: '#F1F5F9', color: '#64748B', textTransform: 'uppercase' }}>{tag}</span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                            <span>Workload Intensity</span>
                            <span>{f.scholars} / {f.maxScholars} Scholars</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#10B981' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
