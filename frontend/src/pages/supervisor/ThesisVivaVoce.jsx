import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

// Helper to load registered scholars from localStorage
function loadScholars() {
  try {
    const raw = localStorage.getItem('rms_all_users')
    if (raw) {
      return JSON.parse(raw)
        .filter(u => (u.role || '').toLowerCase() === 'scholar')
        .map(u => ({ id: u.id, name: u.name, dept: u.dept || 'Computer Science' }))
    }
  } catch { /* ignore */ }
  // Fallbacks
  return [
    { id: 'BDU2020410331', name: 'VIMAL VANI K', dept: 'COMPUTER SCIENCE' },
    { id: 'BDU2021050612', name: 'ANTONY JOHN PRABU J', dept: 'COMPUTER SCIENCE' },
    { id: 'BDU2019882734', name: 'DHANEDDHAMMA K', dept: 'ELECTRONICS & COMM.' },
    { id: 'BDU2022394821', name: 'REX CYRIL B', dept: 'INFORMATION TECH.' },
    { id: 'BDU2020583920', name: 'SARANYA PRIYA A', dept: 'COMPUTER APPLICATIONS' }
  ]
}

const DEFAULT_VIVAS = [
  {
    id: 1,
    regNo: 'BDU2020410331',
    name: 'Miss / Mrs. VIMAL VANI K',
    discipline: 'COMPUTER SCIENCE',
    date: '2026-08-15',
    time: '10:00 AM',
    venue: 'Seminar Hall A',
    examinerName: 'Dr. Ramesh Babu',
    examinerDept: 'Computer Science',
    examinerAddress: '123 University Ave, Chennai',
    examinerSchool: 'IIT Madras',
    status: 'Scheduled'
  },
  {
    id: 2,
    regNo: 'BDU2021050612',
    name: 'Mr. ANTONY JOHN PRABU J',
    discipline: 'COMPUTER SCIENCE',
    date: '2026-09-02',
    time: '02:00 PM',
    venue: 'Department Conference Room',
    examinerName: 'Dr. Sarah Smith',
    examinerDept: 'Data Science',
    examinerAddress: '456 College Road, Bangalore',
    examinerSchool: 'IISc Bangalore',
    status: 'Pending Reports'
  }
]

function ScheduleVivaModal({ onClose, onSave }) {
  const [scholars, setScholars] = useState([])
  const [form, setForm] = useState({
    scholarName: '',
    date: '',
    time: '',
    venue: '',
    examinerName: '',
    examinerDept: '',
    examinerAddress: '',
    examinerSchool: ''
  })

  useEffect(() => {
    setScholars(loadScholars())
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.scholarName || !form.date || !form.time || !form.venue || !form.examinerName || !form.examinerDept || !form.examinerAddress || !form.examinerSchool) {
      toast.error('Please fill in all details')
      return
    }

    const selectedScholarObj = scholars.find(s => s.name === form.scholarName) || { id: 'BDU' + Date.now().toString().slice(-6), dept: 'Research' }

    onSave({
      id: Date.now(),
      regNo: selectedScholarObj.id,
      name: selectedScholarObj.name,
      discipline: selectedScholarObj.dept,
      date: form.date,
      time: form.time,
      venue: form.venue,
      examinerName: form.examinerName,
      examinerDept: form.examinerDept,
      examinerAddress: form.examinerAddress,
      examinerSchool: form.examinerSchool,
      status: 'Scheduled'
    })
    toast.success('Viva Voce exam scheduled successfully!')
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <span className="modal-title">Schedule Viva Voce Meeting</span>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Scholar Selection */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Select Scholar *</label>
              <select name="scholarName" className="form-control form-select" value={form.scholarName} onChange={handleChange} required>
                <option value="">-- Choose Scholar --</option>
                {scholars.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            {/* Date, Time, Venue */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Date *</label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Time *</label>
                <input type="time" name="time" className="form-control" value={form.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Venue *</label>
              <input type="text" name="venue" className="form-control" placeholder="e.g. Conference Hall, Room 102" value={form.venue} onChange={handleChange} required />
            </div>

            {/* Viva Examiner Sub-Section */}
            <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Viva Examiner Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Examiner Name *</label>
                    <input type="text" name="examinerName" className="form-control" placeholder="Dr. Full Name" value={form.examinerName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Department *</label>
                    <input type="text" name="examinerDept" className="form-control" placeholder="e.g. Information Technology" value={form.examinerDept} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Address *</label>
                  <input type="text" name="examinerAddress" className="form-control" placeholder="Full Official Address" value={form.examinerAddress} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>School Studied *</label>
                  <input type="text" name="examinerSchool" className="form-control" placeholder="e.g. Madras University, Anna University" value={form.examinerSchool} onChange={handleChange} required />
                </div>
              </div>
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }}>Schedule Viva</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ThesisVivaVoce() {
  const [vivas, setVivas] = useState([])
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rms_viva_voce_meetings')
      if (stored) {
        setVivas(JSON.parse(stored))
      } else {
        setVivas(DEFAULT_VIVAS)
        localStorage.setItem('rms_viva_voce_meetings', JSON.stringify(DEFAULT_VIVAS))
      }
    } catch {
      setVivas(DEFAULT_VIVAS)
    }
  }, [])

  const saveToStorage = (updated) => {
    setVivas(updated)
    localStorage.setItem('rms_viva_voce_meetings', JSON.stringify(updated))
  }

  const handleSave = (newViva) => {
    const updated = [newViva, ...vivas]
    saveToStorage(updated)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this scheduled Viva Voce meeting?')) {
      const updated = vivas.filter(v => v.id !== id)
      saveToStorage(updated)
      toast.success('Viva Voce meeting removed')
    }
  }

  const filtered = vivas.filter(r =>
    !search ||
    (r.regNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.discipline || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.examinerName || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Modal */}
      {showModal && (
        <ScheduleVivaModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Viva Voce Meeting Schedule</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Schedule and coordinate Viva Voce examinations for Ph.D. scholars
          </span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" style={{ background: '#174EA6', borderColor: '#174EA6', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setShowModal(true)}>
            Schedule Meeting
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Table Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
              style={{ padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: '#fff' }}>
              {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>records</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Search:</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by scholar, examiner..."
              style={{ padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', width: '220px', background: '#fff' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Scholar / Candidate</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Viva Examiner Details</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No viva voce meetings found
                    </td>
                  </tr>
                ) : filtered.slice(0, perPage).map((r, i) => (
                  <tr key={r.id || i}>
                    <td>{i + 1}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reg: {r.regNo}</div>
                        <div style={{ fontSize: '11.5px', color: '#174EA6', fontWeight: 600, marginTop: '2px' }}>{r.discipline}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.date}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{r.time}</div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: '12.5px' }}>{r.venue}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.examinerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dept: {r.examinerDept}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>School: {r.examinerSchool}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.examinerAddress}>Add: {r.examinerAddress}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${r.status === 'Scheduled' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '11px' }}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#B4232A' }} onClick={() => handleDelete(r.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
          <span>Showing 1 to {Math.min(filtered.length, perPage)} of {filtered.length} entries</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn btn-ghost btn-sm">Previous</button>
            <button className="btn btn-ghost btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
