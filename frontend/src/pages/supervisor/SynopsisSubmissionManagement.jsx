import { useState } from 'react'
import toast from 'react-hot-toast'

const synopsisRecords = [
  { regNo: 'BDU2020410331', name: 'Miss / Mrs. VIMAL VANI K', synopsis: 'Cloud Computing Infrastructure Optimization.pdf', validTill: '31-Dec-2024' },
  { regNo: 'BDU2021050612', name: 'Mr. ANTONY JOHN PRABU J', synopsis: 'IoT Security & Wireless Sensor Networks.pdf', validTill: '15-Nov-2024' },
  { regNo: 'BDU2019882734', name: 'Miss / Mrs. DHANEDDHAMMA K', synopsis: 'VLSI Signal Processing & Low-Power Design.pdf', validTill: '28-Feb-2025' },
  { regNo: 'BDU2022394821', name: 'Mr. REX CYRIL B', synopsis: 'Blockchain Protocols for Smart Grids.pdf', validTill: '10-Jan-2025' },
  { regNo: 'BDU2020583920', name: 'Miss / Mrs. SARANYA PRIYA A', synopsis: 'Clinical NLP Decision Support Framework.pdf', validTill: '05-Oct-2024' }
]

export default function SynopsisSubmissionManagement() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)

  const filtered = synopsisRecords.filter(r =>
    !search ||
    r.regNo?.toLowerCase().includes(search.toLowerCase()) ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.synopsis?.toLowerCase().includes(search.toLowerCase())
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
          background: 'linear-gradient(90deg, #1E7D45, #166A3A)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px' }} />
            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>Synopsis Submission</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>v</button>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Close</button>
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, reg no..."
              style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', width: '200px', background: '#fff' }} />
          </div>
        </div>

        <div className="card">
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Registration No.</th>
                  <th>Name</th>
                  <th>Synopsis</th>
                  <th>Valid till</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No data available in table
                    </td>
                  </tr>
                ) : filtered.slice(0, perPage).map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.regNo}</td>
                    <td>{r.name}</td>
                    <td style={{ fontSize: '12px', color: '#166A3A', textDecoration: 'underline', cursor: 'pointer' }}>{r.synopsis}</td>
                    <td><span className="badge badge-success" style={{ fontSize: '11px' }}>{r.validTill}</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => toast.success(`Viewing Synopsis for ${r.name}`)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="btn btn-ghost btn-sm">Previous</button>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Showing 1 to {Math.min(filtered.length, perPage)} of {filtered.length} entries</span>
            <button className="btn btn-ghost btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
