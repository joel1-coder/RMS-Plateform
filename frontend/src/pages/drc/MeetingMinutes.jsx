import { useState } from 'react'
import toast from 'react-hot-toast'

const initialMinutes = [
  { id: 1, committee: 'CS & AI Evaluation Panel', meetingDate: 'Oct 15, 2023', agenda: 'Review of Ph.D. Batch 2021 Synopses', decisions: 'Approved 3 synopses, requested revision for Arjun Mehta.', writer: 'Dr. Mohan Reddy', status: 'Finalized' },
  { id: 2, committee: 'Biotechnology Synopsis Review Board', meetingDate: 'Oct 10, 2023', agenda: 'DRC Research Milestone Progress Assess', decisions: 'Approved annual progress report for Elena Rodriguez.', writer: 'Dr. Linda Gray', status: 'Draft' },
]

export default function MeetingMinutes() {
  const [minutes, setMinutes] = useState(initialMinutes)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMin, setNewMin] = useState({ committee: 'CS & AI Evaluation Panel', meetingDate: '', agenda: '', decisions: '', writer: 'Dr. Mohan Reddy', status: 'Draft' })

  const handleAdd = () => {
    if (!newMin.meetingDate || !newMin.agenda || !newMin.decisions) {
      toast.error('Date, agenda and decisions are required fields')
      return
    }
    setMinutes(p => [...p, { id: Date.now(), ...newMin }])
    toast.success('Meeting Minutes saved successfully!')
    setShowAddModal(false)
    setNewMin({ committee: 'CS & AI Evaluation Panel', meetingDate: '', agenda: '', decisions: '', writer: 'Dr. Mohan Reddy', status: 'Draft' })
  }

  const finalizeMinutes = id => {
    setMinutes(prev => prev.map(m => m.id === id ? { ...m, status: 'Finalized' } : m))
    toast.success('Minutes finalized and signed by Chairman!')
  }

  return (
    <div className="animate-fade">
      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Record DRC Meeting Minutes</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">DRC Committee Board</label>
                <select className="form-control form-select" value={newMin.committee} onChange={e => setNewMin({...newMin, committee: e.target.value})}>
                  <option value="CS & AI Evaluation Panel">CS & AI Evaluation Panel</option>
                  <option value="Biotechnology Synopsis Review Board">Biotechnology Synopsis Review Board</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Meeting Date *</label>
                <input type="date" className="form-control" value={newMin.meetingDate} onChange={e => setNewMin({...newMin, meetingDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Meeting Agenda *</label>
                <input className="form-control" value={newMin.agenda} onChange={e => setNewMin({...newMin, agenda: e.target.value})} placeholder="e.g. Review of Ph.D. Batch 2021 Synopses" />
              </div>
              <div className="form-group">
                <label className="form-label">DRC Decisions & Resolutions *</label>
                <textarea className="form-control" rows={4} value={newMin.decisions} onChange={e => setNewMin({...newMin, decisions: e.target.value})} placeholder="Describe all findings, approvals, or rejection summaries..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#174EA6' }} onClick={handleAdd}>Save Minutes</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Meeting Minutes (MoM)</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Record, review, and digitally sign minutes of DRC research review meetings.</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: '#174EA6' }} onClick={() => setShowAddModal(true)}>
            + Record Minutes
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Committee & Date</th>
                  <th>Agenda / Objective</th>
                  <th>Decisions & Key Resolutions</th>
                  <th>Recorded By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {minutes.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}></span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{m.committee}</div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}> {m.meetingDate}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px', fontWeight: 600 }}>{m.agenda}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '280px' }}>{m.decisions}</td>
                    <td style={{ fontSize: '12.5px', fontWeight: 600 }}>{m.writer}</td>
                    <td>
                      <span className={`badge ${m.status === 'Finalized' ? 'badge-success' : 'badge-warning'}`}>{m.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {m.status === 'Draft' ? (
                          <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={() => finalizeMinutes(m.id)}>
                             Finalize
                          </button>
                        ) : (
                          <button className="btn btn-ghost btn-sm" title="View final signed MoM"> Signed</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
