import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function HODAllocations() {
  const { user } = useAuth()
  const [scholars, setScholars] = useState([])
  const [faculty, setFaculty] = useState([])
  const [selectedScholar, setSelectedScholar] = useState(null)
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const headers = { Authorization: `Bearer ${token}` }
      const deptFilter = user?.dept && user.dept !== 'All' ? `&dept=${user.dept}` : ''

      const [scholarsRes, facultyRes] = await Promise.all([
        fetch(`/api/users?role=scholar${deptFilter}`, { headers }),
        fetch(`/api/users?role=supervisor${deptFilter}`, { headers })
      ])

      const scholarsData = await scholarsRes.json()
      const facultyData = await facultyRes.json()

      const unassigned = scholarsData.filter(s => !s.assignedSupervisorId)
      
      const facultyWithWorkload = facultyData.map(f => {
        const scholarsCount = scholarsData.filter(s => s.assignedSupervisorId === (f.id || f._id)).length
        return {
          id: f.id || f._id,
          name: f.name,
          dept: f.dept,
          available: scholarsCount < 8,
          tags: f.profile?.area ? [f.profile.area] : [],
          scholars: scholarsCount,
          maxScholars: 8,
          color: '#174EA6'
        }
      })

      setScholars(unassigned)
      setFaculty(facultyWithWorkload)
    } catch (err) {
      toast.error('Failed to load allocation data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user?.dept])

  const handleConfirm = async () => {
    if (!selectedScholar || !selectedFaculty) { toast.error('Please select both a scholar and a faculty member'); return }
    
    try {
      const token = localStorage.getItem('rms_token')
      const res = await fetch(`/api/users/${selectedScholar.id || selectedScholar._id}/assign-supervisor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ supervisorId: selectedFaculty.id })
      })

      if (!res.ok) throw new Error('Failed to assign supervisor')

      toast.success(`${selectedScholar.name} assigned to ${selectedFaculty.name}!`)
      fetchData() // Refresh data
      setSelectedScholar(null)
      setSelectedFaculty(null)
      setShowConfirmModal(false)
    } catch (err) {
      toast.error(err.message || 'Error assigning supervisor')
    }
  }

  return (
    <div className="animate-fade">
      {/* Confirm Modal */}
      {showConfirmModal && selectedScholar && selectedFaculty && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <span className="modal-title">Confirm Allocation</span>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                You are about to assign the following scholar to a supervisor:
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ padding: '12px', background: '#F3F7FF', borderRadius: 'var(--radius-md)', border: '1px solid #B9C9EA' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0A2A66', marginBottom: '4px' }}>SCHOLAR</div>
                  <div style={{ fontWeight: 700 }}>{selectedScholar.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedScholar.topic}</div>
                </div>
                <div style={{ padding: '12px', background: '#E7F4EC', borderRadius: 'var(--radius-md)', border: '1px solid #B8DFC6' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#166A3A', marginBottom: '4px' }}>FACULTY</div>
                  <div style={{ fontWeight: 700 }}>{selectedFaculty.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedFaculty.dept}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }} onClick={handleConfirm}> Confirm Allocation</button>
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
            style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }}
            onClick={() => selectedScholar && selectedFaculty ? setShowConfirmModal(true) : toast.error('Select a scholar and faculty member first')}
          >
             Confirm Allocation
          </button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Unassigned Scholars */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Unassigned Scholars</div>
              <span style={{ background: '#FFF6D8', color: '#936C00', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
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
                      key={s.id || s._id}
                      onClick={() => setSelectedScholar(prev => (prev?.id || prev?._id) === (s.id || s._id) ? null : s)}
                      style={{
                        padding: '14px', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s',
                        border: `2px solid ${(selectedScholar?.id || selectedScholar?._id) === (s.id || s._id) ? '#174EA6' : 'var(--border)'}`,
                        background: (selectedScholar?.id || selectedScholar?._id) === (s.id || s._id) ? `#174EA608` : '#F8FAFC',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#174EA6' }}>{s.name.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{s.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.id}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{s.profile?.area || 'No Area Specified'}</div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {(s.profile?.area ? [s.profile.area] : []).map(tag => (
                            <span key={tag} style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '99px', background: `#174EA618`, color: '#174EA6', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {scholars.length === 0 && (
                  <div className="empty-state"><div className="empty-icon"></div><h3>All scholars assigned!</h3><p>No pending allocations.</p></div>
                )}
              </div>
            </div>
          </div>

          {/* Faculty Pool */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Faculty Pool</div>
              <span style={{ background: '#E7F4EC', color: '#166A3A', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
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
                            <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? '#B4232A' : pct >= 70 ? '#C89B1E' : '#1E7D45' }} />
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
