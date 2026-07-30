import { useState } from 'react'
import toast from 'react-hot-toast'

const vivaRecords = [
  { regNo: 'BDU2020410331', name: 'Miss / Mrs. VIMAL VANI K', discipline: 'COMPUTER SCIENCE', status: 'Scheduled (Aug 15, 2024)', cancellation: 'No' },
  { regNo: 'BDU2021050612', name: 'Mr. ANTONY JOHN PRABU J', discipline: 'COMPUTER SCIENCE', status: 'Pending Reports', cancellation: 'No' },
  { regNo: 'BDU2019882734', name: 'Miss / Mrs. DHANEDDHAMMA K', discipline: 'ELECTRONICS & COMM.', status: 'Completed (Pass)', cancellation: 'No' },
  { regNo: 'BDU2022394821', name: 'Mr. REX CYRIL B', discipline: 'INFORMATION TECH.', status: 'Scheduled (Aug 28, 2024)', cancellation: 'No' },
  { regNo: 'BDU2020583920', name: 'Miss / Mrs. SARANYA PRIYA A', discipline: 'COMPUTER APPLICATIONS', status: 'Awaiting External Consent', cancellation: 'No' }
]

export default function ThesisVivaVoce() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)

  const filtered = vivaRecords.filter(r =>
    !search ||
    r.regNo?.toLowerCase().includes(search.toLowerCase()) ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.discipline?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Thesis Viva-voce</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            List of viva-voce exams scheduled or completed
          </span>
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
              placeholder="Search by name, reg no..."
              style={{ padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', width: '200px', background: '#fff' }}
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
                  <th>Registration No. ⇅</th>
                  <th>Applicant Name ⇅</th>
                  <th>Discipline Name ⇅</th>
                  <th>Viva Status ⇅</th>
                  <th>Cancellation ⇅</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No data available in table
                    </td>
                  </tr>
                ) : filtered.slice(0, perPage).map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.regNo}</td>
                    <td>{r.name}</td>
                    <td><span style={{ fontSize: '12px', color: '#4338CA', fontWeight: 600 }}>{r.discipline}</span></td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '11px' }}>{r.status}</span>
                    </td>
                    <td>{r.cancellation}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => toast.success(`Viewing Viva details for ${r.name}`)}>
                        Details
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
