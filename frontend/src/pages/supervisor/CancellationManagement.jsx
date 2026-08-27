import { useState } from 'react'
import toast from 'react-hot-toast'

const cancellationRecords = [
  { id: 1, regNo: 'BDU5020/20931', name: 'Miss / Mrs. VIMAL VANI K', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
  { id: 2, regNo: 'BDU20/0506', name: 'Miss / Mrs. DHANEDDHAMMA K', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
  { id: 3, regNo: '48590/PH.D.K3/COMPUTER SCIENCE/FULL TIME/JANUARY 2018/DATE: 30.10.2018', name: 'Miss / Mrs. SARANYA PRIYA A', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
  { id: 4, regNo: '07265/PH.D.K3/COMPUTER SCIENCE/FULL TIME/APRIL 2018/DATE: 30.03.2016', name: 'Miss / Mrs. ANGELPREETHA A', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
  { id: 5, regNo: '07265/PH.D.K3/COMPUTER SCIENCE/FULL TIME/APRIL 2016/DATE: 30.03.2016', name: 'Miss / Mrs. BEATRICE, DOROTHY A', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
  { id: 6, regNo: '28509/PH.D.K3/COMPUTER SCIENCE/PART TIME/OCTOBER 2012/DATE: 13.10.2012', name: 'Mr. VIMAL ROSY J', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
  { id: 7, regNo: '47489/PH.D.K3/COMPUTER SCIENCE/PART TIME/JANUARY 2013/DATE: 26.12.2012', name: 'Mr. ANTONY JOHN PRABU J', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
  { id: 8, regNo: '47406/PH.D.K3/COMPUTER SCIENCE/PART TIME/JANUARY 2013/DATE: 26.12.2012', name: 'Mr. REX CYRIL B', discipline: 'COMPUTER SCIENCE (FACULTY OF SCIENCE)' },
]

export default function CancellationManagement() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = cancellationRecords.filter(r =>
    !search ||
    r.regNo.toLowerCase().includes(search.toLowerCase()) ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.discipline.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const handleCancel = (id, name) => {
    toast.success(`Cancellation processed for ${name}`)
  }

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Cancellation</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Manage scholar cancellation requests
          </span>
        </div>
      </div>

      <div className="page-body">

        {/* Active Banner */}
            <div style={{
              background: 'linear-gradient(90deg, #174EA6, #0A2A66)',
              borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px' }} />
                <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>Cancellation</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>v</button>
                <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Close</button>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
                  style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
                  {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
                </select>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>records</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Search:</span>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', width: '200px', background: '#fff' }} />
              </div>
            </div>

            <div className="card">
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}>#</th>
                      <th>REGISTRATION NO.</th>
                      <th>APPLICANT NAME</th>
                      <th>DISCIPLINE NAME</th>
                      <th>CANCELLATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
                          No data available in table
                        </td>
                      </tr>
                    ) : paged.map((r, i) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{(page - 1) * perPage + i + 1}</td>
                        <td style={{ fontSize: '11.5px', lineHeight: 1.5 }}>{r.regNo}</td>
                        <td style={{ fontSize: '12.5px', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{r.discipline}</td>
                        <td>
                          <button
                            onClick={() => handleCancel(r.id, r.name)}
                            style={{
                              padding: '5px 14px', background: 'linear-gradient(90deg,#B4232A,#9F1E24)',
                              color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
                              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(180,35,42,0.28)',
                            }}
                          >
                            Cancellation
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Showing {paged.length > 0 ? (page - 1) * perPage + 1 : 0} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn btn-ghost btn-sm">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{
                        padding: '5px 10px', border: `1px solid ${page === p ? '#0A2A66' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)', background: page === p ? '#0A2A66' : '#fff',
                        color: page === p ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontWeight: page === p ? 700 : 400, fontSize: '12.5px',
                      }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn btn-ghost btn-sm">Next</button>
                </div>
              </div>
            </div>

        <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          2024 Research Section Management
        </div>
      </div>
    </div>
  )
}
