import { useState } from 'react'
import toast from 'react-hot-toast'

const vivaRecords = []

export default function ThesisVivaVoce() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

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
                  <th>Cancellation ⇅</th>
                </tr>
              </thead>
              <tbody>
                {vivaRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No data available in table
                    </td>
                  </tr>
                ) : vivaRecords.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.regNo}</td>
                    <td>{r.name}</td>
                    <td>{r.discipline}</td>
                    <td>{r.cancellation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          Showing 0 to 0 of 0 entries
        </div>
      </div>
    </div>
  )
}
