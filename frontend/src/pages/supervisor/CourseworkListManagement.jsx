import { useState } from 'react'
import toast from 'react-hot-toast'

const courseworkRecords = [
  { regNo: '29338/PH.D.K3/COMPUTER SCIENCE/PART TIME/JANUARY 2016/DATE: 18.10.2016', discipline: 'COMPUTER SCIENCE' },
  { regNo: '40387/PH.D.K3/COMPUTER SCIENCE/FULL TIME/JANUARY 2017/DATE: 28.12.2016', discipline: 'COMPUTER SCIENCE' },
  { regNo: '07395/PH.D.K3/COMPUTER SCIENCE/PART TIME/APRIL 2016/DATE: 30.03.2016', discipline: 'COMPUTER SCIENCE' },
  { regNo: '07265/PH.D.K3/COMPUTER SCIENCE/FULL TIME/APRIL 2016/DATE: 30.03.2016', discipline: 'COMPUTER SCIENCE' },
  { regNo: '28509/PH.D.K3/COMPUTER SCIENCE/PART TIME/OCTOBER 2012/DATE: 13.10.2012', discipline: 'COMPUTER SCIENCE' },
  { regNo: '47489/PH.D.K3/COMPUTER SCIENCE/PART TIME/JANUARY 2013/DATE: 26.12.2012', discipline: 'COMPUTER SCIENCE' },
  { regNo: '47395/PH.D.K3/COMPUTER SCIENCE/PART TIME/JANUARY 2013/DATE: 26.12.2012', discipline: 'COMPUTER SCIENCE' },
  { regNo: '34008/PH.D.K3/COMPUTER SCIENCE/PART TIME/OCTOBER 2012/DATE: 13.10.2012', discipline: 'COMPUTER SCIENCE' },
  { regNo: 'BDU2020410331', discipline: 'COMPUTER SCIENCE' },
]

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '👤', label: 'Account Details' },
  { icon: '👥', label: 'Scholars List' },
  { icon: '📄', label: 'DC-Constitution' },
  { icon: '📊', label: 'DC-I Status' },
  { icon: '📝', label: 'Coursework Mark Entry', active: true },
  { icon: '🤝', label: 'Co-Supervisor Nomination' },
  { icon: '📋', label: 'Synopsis Submission' },
  { icon: '📚', label: 'Thesis Submission' },
  { icon: '🔬', label: 'Examiner Panel' },
  { icon: '🎓', label: 'Thesis Viva-voce' },
  { icon: '❌', label: 'Cancellation' },
]

export default function CourseworkListManagement() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = courseworkRecords.filter(r =>
    r.regNo.toLowerCase().includes(search.toLowerCase()) ||
    r.discipline.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Coursework List</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            List of registered coursework details for scholars
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Table Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Show</span>
            <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
              style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
              {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
            </select>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>records</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', width: '200px', background: '#fff' }} />
          </div>
        </div>

        <div className="card">
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>#</th>
                  <th>REGISTRATION NO</th>
                  <th>DISCIPLINE</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, perPage).map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ fontSize: '12px', lineHeight: 1.5 }}>{r.regNo}</td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#4338CA', fontWeight: 600 }}>{r.discipline}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Showing 1 to {Math.min(perPage, filtered.length)} of {filtered.length} entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn btn-ghost btn-sm">Previous</button>
              <button style={{ padding: '5px 10px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', fontSize: '12.5px' }}>1</button>
              <button className="btn btn-ghost btn-sm">Next</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>© 2024 Research Section Management</div>
      </div>
    </div>
  )
}
