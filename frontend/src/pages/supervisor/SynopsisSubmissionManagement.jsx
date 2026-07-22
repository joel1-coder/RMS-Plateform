import { useState } from 'react'
import toast from 'react-hot-toast'

const synopsisRecords = []

const NAV_ITEMS = [
  { label: 'Dashboard' }, { label: 'Account Details' }, { label: 'Scholars List' },
  { label: 'DC-Constitution' }, { label: 'DC-I Status' }, { label: 'Coursework Mark Entry' },
  { label: 'Co-Supervisor Nomination' }, { label: 'Synopsis Submission', active: true },
  { label: 'Thesis Submission' }, { label: 'Examiner Panel' },
  { label: 'Thesis Viva-voce' }, { label: 'Cancellation' },
]

export default function SynopsisSubmissionManagement() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)

  const filtered = synopsisRecords.filter(r =>
    !search || r.regNo?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Synopsis Submission</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            List of submitted synopses under review
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Active Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #059669, #10B981)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px' }}>📋</span>
            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>Synopsis Submission</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>∨</button>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>✕</button>
          </div>
        </div>

        {/* Controls */}
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

        <div className="card">
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Registration No. ⇅</th>
                  <th>Name ⇅</th>
                  <th>Synopsis ⇅</th>
                  <th>Valid till ⇅</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No data available in table
                    </td>
                  </tr>
                ) : filtered.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.regNo}</td>
                    <td>{r.name}</td>
                    <td>{r.synopsis}</td>
                    <td>{r.validTill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="btn btn-ghost btn-sm">Previous</button>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Showing 0 to 0 of 0 entries</span>
            <button className="btn btn-ghost btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
