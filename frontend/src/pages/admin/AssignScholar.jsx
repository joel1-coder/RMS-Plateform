import { apiFetch } from '../../utils/api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AssignScholar() {
  const [users, setUsers] = useState([])
  const [scholars, setScholars] = useState([])
  const [supervisors, setSupervisors] = useState([])
  const [selectedScholar, setSelectedScholar] = useState('')
  const [selectedSupervisor, setSelectedSupervisor] = useState('')
  const [supervisorSearch, setSupervisorSearch] = useState('')
  const [loading, setLoading] = useState(true)

  /* ─── load on mount ─── */
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const list = await response.json()
      hydrate(list)
    } catch {
      toast.error('Failed to load user directories')
    } finally {
      setLoading(false)
    }
  }

  const hydrate = (list) => {
    const safeList = Array.isArray(list)
      ? list.map(u => ({ ...u, role: u.role ? u.role.toLowerCase() : u.role }))
      : []
    setUsers(safeList)
    setScholars(safeList.filter(u => u && u.role === 'scholar' && u.status !== 'Inactive'))
    setSupervisors(safeList.filter(u => u && u.role === 'supervisor' && u.status !== 'Inactive'))
  }

  const handleSupervisorSearchChange = (e) => {
    const val = e.target.value
    setSupervisorSearch(val)
    const matched = supervisors.find(s => `${s.name} (${s.dept})` === val || s.name === val)
    if (matched) {
      setSelectedSupervisor(matched.id || matched._id)
    } else {
      setSelectedSupervisor('')
    }
  }

  /* ─── assign ─── */
  const handleAssign = async (e) => {
    e.preventDefault()
    if (!selectedScholar || !selectedSupervisor) {
      toast.error('Please select both a scholar and a supervisor.')
      return
    }

    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch(`/api/users/${selectedScholar}/assign-supervisor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ supervisorId: selectedSupervisor })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to assign supervisor')
      }

      toast.success('Scholar assigned successfully!')
      setSelectedScholar('')
      setSelectedSupervisor('')
      setSupervisorSearch('')
      loadUsers()
    } catch (err) {
      toast.error(err.message || 'An error occurred')
    }
  }

  /* ─── reassign ─── */
  const handleReassign = async (scholarId, newSupId) => {
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch(`/api/users/${scholarId}/assign-supervisor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ supervisorId: newSupId })
      })

      if (!response.ok) throw new Error()
      toast.success('Supervisor reassigned successfully!')
      loadUsers()
    } catch {
      toast.error('Failed to reassign supervisor')
    }
  }

  /* ─── unassign ─── */
  const handleUnassign = async (scholarId) => {
    if (!window.confirm("Remove this scholar's supervisor assignment?")) return
    try {
      const token = localStorage.getItem('rms_token')
      const response = await apiFetch(`/api/users/${scholarId}/unassign-supervisor`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error()
      toast.success('Scholar allocation unlinked.')
      loadUsers()
    } catch {
      toast.error('Failed to unlink assignment')
    }
  }

  /* ─── derived lists ─── */
  const unassignedScholars = scholars.filter(s => !s.assignedSupervisor)
  const assignedScholars = scholars.filter(s => s.assignedSupervisor)

  /* ─── per-supervisor counts ─── */
  const supLoad = supervisors.map(sup => ({
    ...sup,
    count: scholars.filter(s => String(s.assignedSupervisorId) === String(sup.id || sup._id)).length,
  }))

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">Assign Scholar to Supervisor</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Manage scholar allocations and supervisory assignments
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
          {[
            { label: 'Total Scholars', value: scholars.length, icon: '🎓', color: 'purple' },
            { label: 'Assigned', value: assignedScholars.length, icon: '✅', color: 'green' },
            { label: 'Unassigned', value: unassignedScholars.length, icon: '⏳', color: 'orange' },
            { label: 'Supervisors', value: supervisors.length, icon: '👨‍🏫', color: 'blue' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '--' : s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Left panel: form + supervisor load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Assignment form */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">🔗 New Assignment</div>
              </div>
              <form onSubmit={handleAssign} style={{ padding: '20px' }}>
                {unassignedScholars.length === 0 ? (
                  <div style={{ padding: '16px', background: '#F0FDF4', borderRadius: 8, color: '#15803D', fontWeight: 600, fontSize: 13, textAlign: 'center' }}>
                    ✅ All scholars are already assigned!
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Select Scholar *</label>
                      <select
                        className="form-control form-select"
                        value={selectedScholar}
                        onChange={e => setSelectedScholar(e.target.value)}
                        required
                      >
                        <option value="">-- Choose Scholar --</option>
                        {unassignedScholars.map(s => (
                          <option key={s.id || s._id} value={s.id || s._id}>{s.name} · {s.dept}</option>
                        ))}
                      </select>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        Only unassigned scholars are listed.
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 14 }}>
                      <label className="form-label">Select Supervisor *</label>
                      <input
                        list="supervisors-datalist"
                        className="form-control"
                        placeholder="Type to search supervisor..."
                        value={supervisorSearch}
                        onChange={handleSupervisorSearchChange}
                        required
                      />
                      <datalist id="supervisors-datalist">
                        {supervisors.map(s => (
                          <option key={s.id || s._id} value={`${s.name} (${s.dept})`} />
                        ))}
                      </datalist>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: 18, background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}
                      disabled={!selectedScholar || !selectedSupervisor}
                    >
                      🔗 Assign Scholar
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Supervisor load card */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">👨‍🏫 Supervisor Load</div>
              </div>
              <div style={{ padding: '12px 16px', maxHeight: '300px', overflowY: 'auto' }}>
                {supLoad.map(sup => (
                  <div key={sup.id || sup._id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{sup.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{sup.count} scholar{sup.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 7 }}>
                      <div className="progress-fill" style={{
                        width: `${Math.min((sup.count / 6) * 100, 100)}%`,
                        background: sup.count >= 6 ? '#EF4444' : sup.count >= 4 ? '#F59E0B' : '#10B981'
                      }} />
                    </div>
                  </div>
                ))}
                {supLoad.length === 0 && (
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
                    No supervisors in the system yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: current allocations table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Current Allocations</div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {assignedScholars.length} assigned · {unassignedScholars.length} pending
              </span>
            </div>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Scholar</th>
                    <th>Department</th>
                    <th>Assigned Supervisor</th>
                    <th>Reassign</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedScholars.length > 0 ? assignedScholars.map(scholar => (
                    <tr key={scholar.id || scholar._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar avatar-sm" style={{ background: `hsl(${((scholar.id || scholar._id).toString().charCodeAt(0) * 55) % 360},60%,55%)` }}>
                            {scholar.name.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{scholar.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{scholar.dept}</td>
                      <td>
                        <span style={{ padding: '4px 10px', background: '#EDE9FE', borderRadius: 6, fontSize: 12.5, fontWeight: 700, color: '#4F46E5' }}>
                          👨‍🏫 {scholar.assignedSupervisor}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control form-select"
                          style={{ fontSize: 12, padding: '4px 8px', width: '160px' }}
                          defaultValue=""
                          onChange={e => { if (e.target.value) handleReassign(scholar.id || scholar._id, e.target.value) }}
                        >
                          <option value="">Change…</option>
                          {supervisors
                            .filter(s => String(s.id || s._id) !== String(scholar.assignedSupervisorId))
                            .map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name}</option>)
                          }
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#EF4444', fontWeight: 600 }}
                          onClick={() => handleUnassign(scholar.id || scholar._id)}
                          title="Remove assignment"
                        >
                          Unlink
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No assignments yet. Use the form on the left to assign scholars.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Unassigned scholars list */}
            {unassignedScholars.length > 0 && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: '#FFFBEB' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#D97706', marginBottom: 8 }}>
                  ⚠️ {unassignedScholars.length} Scholar{unassignedScholars.length > 1 ? 's' : ''} pending assignment:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {unassignedScholars.map(s => (
                    <span key={s.id || s._id} style={{ padding: '3px 10px', background: '#FEF3C7', borderRadius: 99, fontSize: 12, fontWeight: 600, color: '#92400E' }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
