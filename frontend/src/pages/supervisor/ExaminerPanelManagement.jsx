import { useState } from 'react'
import toast from 'react-hot-toast'

const examinerRecords = [
  { regNo: 'BDU2020410331', discipline: 'COMPUTER SCIENCE', name: 'Miss / Mrs. VIMAL VANI K', status: 'Active' },
  { regNo: 'BDU2021050612', discipline: 'COMPUTER SCIENCE', name: 'Mr. ANTONY JOHN PRABU J', status: 'Pending Nomination' },
  { regNo: 'BDU2019882734', discipline: 'ELECTRONICS & COMM.', name: 'Miss / Mrs. DHANEDDHAMMA K', status: 'Evaluation Active' },
  { regNo: 'BDU2022394821', discipline: 'INFORMATION TECH.', name: 'Mr. REX CYRIL B', status: 'Report Received' },
  { regNo: 'BDU2020583920', discipline: 'COMPUTER APPLICATIONS', name: 'Miss / Mrs. SARANYA PRIYA A', status: 'Pending Nomination' }
]

export default function ExaminerPanelManagement() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [pendingNominations] = useState(2)
  const [evaluationActive] = useState(3)

  const filtered = examinerRecords.filter(r =>
    !search || r.regNo?.toLowerCase().includes(search.toLowerCase()) || r.name?.toLowerCase().includes(search.toLowerCase()) || r.discipline?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Examiner Panel</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Manage and track external examiners for research evaluation
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
              style={{ padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
              {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
            </select>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>records</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Advanced Filter
            </button>
            <button
              style={{ padding: '8px 16px', background: 'linear-gradient(90deg,#0A2A66,#174EA6)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => toast.success('Add Examiner form opened!')}
            >
              Add Examiner
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }} />
            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>Examiner Panel - Candidate List</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Show</span>
                <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
                  style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px', background: '#fff' }}>
                  {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
                </select>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>records</span>
              </div>
              <input placeholder="Search by name or reg no..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', width: '200px', background: '#fff' }} />
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>REGISTRATION NO</th>
                  <th>DISCIPLINE</th>
                  <th>APPLICANT NAME</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No data available in table
                      <br /><span style={{ fontSize: '12px', color: '#94A3B8' }}>Try adjusting your filters or search criteria.</span>
                    </td>
                  </tr>
                ) : filtered.slice(0, perPage).map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.regNo}</td>
                    <td><span style={{ fontSize: '12px', color: '#174EA6', fontWeight: 600 }}>{r.discipline}</span></td>
                    <td>{r.name}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => toast.success(`Viewing panel for ${r.name}`)}>
                        View Panel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm">Previous</button>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Showing 1 to {Math.min(filtered.length, perPage)} of {filtered.length} entries</span>
            <button className="btn btn-ghost btn-sm">Next</button>
          </div>
        </div>

        {/* Status Overview + AI Matching */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card">
            <div className="card-header">
              <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Status Overview
              </div>
            </div>
            <div className="card-body" style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Real-time statistics for examiner assignments and thesis evaluations.
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Pending Nominations</div>
                  <div style={{ fontWeight: 800, fontSize: '22px', color: 'var(--text-primary)' }}>{pendingNominations}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Evaluation Active</div>
                  <div style={{ fontWeight: 800, fontSize: '22px', color: 'var(--text-primary)' }}>{evaluationActive}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg,#061B44,#0A2A66)', color: '#fff' }}>
            <div className="card-body">
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Automated Examiner Matching
              </div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '14px' }}>
                Our new AI-powered system helps you find the most suitable examiners based on research discipline and citation records.
              </div>
              <button
                onClick={() => toast.success('AI Examiner Matching activated!')}
                style={{
                  padding: '8px 16px', background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-md)',
                  color: '#fff', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                TRY SMART MATCHING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
