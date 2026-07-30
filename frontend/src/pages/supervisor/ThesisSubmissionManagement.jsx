import { useState } from 'react'
import toast from 'react-hot-toast'

const thesisRecords = [
  { regNo: 'BDU2020410331', name: 'Miss / Mrs. VIMAL VANI K', discipline: 'COMPUTER SCIENCE', thesis: 'Deep Learning Approaches in Healthcare Diagnostics.pdf', revision: 'Revision 1 (Submitted)' },
  { regNo: 'BDU2021050612', name: 'Mr. ANTONY JOHN PRABU J', discipline: 'COMPUTER SCIENCE', thesis: 'Secure IoT Protocols for Smart Cities.pdf', revision: 'Initial Submission' },
  { regNo: 'BDU2019882734', name: 'Miss / Mrs. DHANEDDHAMMA K', discipline: 'ELECTRONICS & COMM.', thesis: 'VLSI Architecture for High-Speed Signal Processing.pdf', revision: 'Final Copy' },
  { regNo: 'BDU2022394821', name: 'Mr. REX CYRIL B', discipline: 'INFORMATION TECH.', thesis: 'Blockchain Framework for Distributed Supply Chains.pdf', revision: 'Initial Submission' },
  { regNo: 'BDU2020583920', name: 'Miss / Mrs. SARANYA PRIYA A', discipline: 'COMPUTER APPLICATIONS', thesis: 'Natural Language Processing for Clinical Decision Systems.pdf', revision: 'Revision 2 (Under Review)' }
]

export default function ThesisSubmissionManagement() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)

  const filtered = thesisRecords.filter(r =>
    !search ||
    r.regNo?.toLowerCase().includes(search.toLowerCase()) ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.discipline?.toLowerCase().includes(search.toLowerCase()) ||
    r.thesis?.toLowerCase().includes(search.toLowerCase())
  )

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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, reg no..."
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No data available in table
                    </td>
                  </tr>
                ) : filtered.slice(0, perPage).map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.regNo}</td>
                    <td>{r.name}</td>
                    <td><span style={{ fontSize: '12px', color: '#4338CA', fontWeight: 600 }}>{r.discipline}</span></td>
                    <td style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'underline', cursor: 'pointer' }}>📄 {r.thesis}</td>
                    <td><span className="badge badge-warning" style={{ fontSize: '11px' }}>{r.revision}</span></td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => toast.success(`Opening Thesis for ${r.name}`)}>
                        View Thesis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost btn-sm">Previous</button>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Showing 1 to {Math.min(filtered.length, perPage)} of {filtered.length} entries</span>
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
