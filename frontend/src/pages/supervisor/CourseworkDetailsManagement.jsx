import { useState } from 'react'
import toast from 'react-hot-toast'

const scholarDetails = {
  regNo: 'VANI K [BDU2020410331] | COMPUTER SCIENCE - FACULTY OF SCIENCE',
  dcMembers: [
    {
      role: 'Research Adviser',
      name: 'Dr. BRITTO RAMESH KUMAR S.',
      designation: 'Assistant Professor',
      dept: 'COMPUTER SCIENCE, ST. JOSEPH\'S COLLEGE (AUTONOMOUS)',
      city: '(AUTONOMOUS) Tiruchirappalli - 620002',
      accountInfo: 'Britto Ramesh Kumar S 00810500004054204 SBI:000002 State Indian Bank Main Branch',
    },
    {
      role: 'DC Member 1',
      name: 'Dr. J.P. Charles',
      designation: 'Assistant Professor',
      dept: 'Dept of Information Technology, ST. JOSEPH\'S COLLEGE (AUTONOMOUS)',
      city: 'New Chathram Road Silarai, Trichy - 620002',
      accountInfo: 'Joseph Charles P 0081050000444024 SBI:000002 South Indian Bank Main Branch',
    },
    {
      role: 'DC Member 2',
      name: 'Dr. M.Kasthuri',
      designation: 'Assistant Professor',
      dept: 'Dept of Computer Applications, Bishop Heber College, Attirami Road, Vayalur Road, Puthur',
      city: 'Trichy - 620017',
      accountInfo: 'M.Kasthuri 4094000070184SS PLN80416410 Punjab National Bank Puthur Branch, Bishop Heber College Campus',
    },
  ],
}

export default function CourseworkDetailsManagement() {
  const [marks, setMarks] = useState([
    { subject: 'CLOUD COMPUTING [JOHPHCS0011', examDate: '', maxMark: 100, minMark: 50, scoredMark: '', creditMark: '', result: 'Auto calculated' },
  ])
  const [saving, setSaving] = useState(false)

  const handleMarkChange = (idx, key, val) => {
    setMarks(prev => prev.map((m, i) => i === idx ? { ...m, [key]: val } : m))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Coursework details saved!')
    setSaving(false)
  }

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Coursework Mark Entry</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            View and add coursework details for scholars
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Breadcrumb */}
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          ✓ Coursework Mark Entry
        </div>

        {/* Scholar Header */}
        <div style={{
          background: 'linear-gradient(90deg, #4F46E5, #6C63FF)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '20px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>
            🔍 View / Add Coursework Details - {scholarDetails.regNo}
          </div>
        </div>

        {/* DC Members Cards */}
        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Coursework Details <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>add details here.</span>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body">
            {/* DC Members Table */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto auto auto', gap: '0', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {/* Header */}
                <div style={{ padding: '10px 14px', background: '#F1F5F9', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border)' }}>DC MEMBER</div>
                <div style={{ padding: '10px 14px', background: '#F1F5F9', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border)', gridColumn: '2/4' }}>NAME & ADDRESS</div>
                <div style={{ padding: '10px 14px', background: '#F1F5F9', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border)' }}>ACCOUNT INFORMATION</div>
                <div style={{ padding: '10px 14px', background: '#F1F5F9', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border)' }}>SITTING FEE DS.1+</div>
                <div style={{ padding: '10px 14px', background: '#F1F5F9', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border)' }}>TA / DA CLASS DS.1+</div>

                {/* Rows */}
                {scholarDetails.dcMembers.map((m, i) => (
                  <>
                    <div key={`role-${i}`} style={{ padding: '12px 14px', fontSize: '12.5px', fontWeight: 600, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      {m.role}
                    </div>
                    <div style={{ padding: '12px 14px', fontSize: '12px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', gridColumn: '2/4' }}>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>{m.name}</div>
                      <div style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{m.designation}<br />{m.dept}<br />{m.city}</div>
                    </div>
                    <div style={{ padding: '12px 14px', fontSize: '11.5px', color: 'var(--text-muted)', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', lineHeight: 1.5 }}>
                      {m.accountInfo}
                    </div>
                    <div style={{ padding: '12px 14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      <input type="number" placeholder="0"
                        style={{ width: '60px', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', textAlign: 'center' }} />
                    </div>
                    <div style={{ padding: '12px 14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      <input type="number" placeholder="0"
                        style={{ width: '60px', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', textAlign: 'center' }} />
                    </div>
                  </>
                ))}
              </div>
            </div>

            {/* Mark Entry */}
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px' }}>Mark Entry</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SUBJECT NAME</th>
                    <th>EXAM DATE</th>
                    <th>MAX MARK</th>
                    <th>MIN MARK</th>
                    <th>SCORED MARK</th>
                    <th>CREDIT MARK</th>
                    <th>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td style={{ fontSize: '12.5px', maxWidth: '200px' }}>{m.subject}</td>
                      <td>
                        <input type="date" value={m.examDate} onChange={e => handleMarkChange(i, 'examDate', e.target.value)}
                          style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px', width: '130px' }} />
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{m.maxMark}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{m.minMark}</td>
                      <td>
                        <input type="text" value={m.scoredMark} onChange={e => handleMarkChange(i, 'scoredMark', e.target.value)} placeholder="Enter Mark"
                          style={{ width: '90px', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }} />
                      </td>
                      <td>
                        <input type="text" value={m.creditMark} onChange={e => handleMarkChange(i, 'creditMark', e.target.value)} placeholder="Enter Credit"
                          style={{ width: '90px', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }} />
                      </td>
                      <td>
                        <span style={{ fontSize: '11.5px', color: '#6C63FF', fontStyle: 'italic' }}>{m.result}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 28px', background: 'linear-gradient(90deg,#4F46E5,#6C63FF)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '13.5px',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
            }}>
            {saving ? '⏳ Saving...' : '💾 Save Details'}
          </button>
        </div>
      </div>
    </div>
  )
}
