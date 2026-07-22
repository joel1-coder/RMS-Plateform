import { useState } from 'react'
import toast from 'react-hot-toast'

const thesisRecords = []

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '👤', label: 'Account Details' },
  { icon: '👥', label: 'Scholars List' },
  { icon: '📄', label: 'DC-Constitution' },
  { icon: '📊', label: 'DC-I Status' },
  { icon: '📝', label: 'Coursework Mark Entry' },
  { icon: '🤝', label: 'Co-Supervisor Nomination' },
  { icon: '📋', label: 'Synopsis Submission' },
  { icon: '📚', label: 'Thesis Submission', active: true },
  { icon: '🔬', label: 'Examiner Panel' },
  { icon: '🎓', label: 'Thesis Viva-voce' },
  { icon: '❌', label: 'Cancellation' },
]

export default function ThesisSubmissionManagement() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Thesis Submission List</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            List of submitted theses for evaluation
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Blue Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: '14px' }}>📚</span>
          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>Thesis Submission List</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>∨</button>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>✕</button>
          </div>
        </div>

        {/* Table Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
              style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
              {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
            </select>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>records</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Search:</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', width: '200px', background: '#fff' }} />
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Register No. ⇅</th>
                  <th>Name ⇅</th>
                  <th>Discipline ⇅</th>
                  <th>Thesis ⇅</th>
                  <th>Revision ⇅</th>
                </tr>
              </thead>
              <tbody>
                {thesisRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No data available in table
                    </td>
                  </tr>
                ) : thesisRecords.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.regNo}</td>
                    <td>{r.name}</td>
                    <td>{r.discipline}</td>
                    <td>{r.thesis}</td>
                    <td>{r.revision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost btn-sm">Previous</button>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Showing 0 to 0 of 0 entries</span>
            <button className="btn btn-ghost btn-sm">Next</button>
          </div>
        </div>

        <div style={{ marginTop: '20px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          © 2024 Research Section Management
        </div>
      </div>
    </div>
  )
}
