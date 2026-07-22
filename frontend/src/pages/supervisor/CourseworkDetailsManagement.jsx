import { useState } from 'react'
import toast from 'react-hot-toast'

const scholarDetails = {
  regNo: 'VANI K [BDU2020410331] | COMPUTER SCIENCE - FACULTY OF SCIENCE',
}

export default function CourseworkDetailsManagement() {
  const [marks, setMarks] = useState([
    { subject: 'RESEARCH METHODOLOGY [JOHPHCS001]', examDate: '', maxMark: 100, minMark: 50, scoredMark: '', creditMark: '', result: 'Auto calculated' },
    { subject: 'ADVANCED COMPUTER SCIENCE [JOHPHCS002]', examDate: '', maxMark: 100, minMark: 50, scoredMark: '', creditMark: '', result: 'Auto calculated' },
    { subject: 'CLOUD COMPUTING [JOHPHCS0011]', examDate: '', maxMark: 100, minMark: 50, scoredMark: '', creditMark: '', result: 'Auto calculated' },
    { subject: 'ELECTIVE / SPECIAL PAPER [JOHPHCS0012]', examDate: '', maxMark: 100, minMark: 50, scoredMark: '', creditMark: '', result: 'Auto calculated' },
  ])
  const [saving, setSaving] = useState(false)

  const handleMarkChange = (idx, key, val) => {
    setMarks(prev => prev.map((m, i) => i === idx ? { ...m, [key]: val } : m))
  }

  const handleAddRow = () => {
    setMarks(prev => [
      ...prev,
      { subject: '', examDate: '', maxMark: 100, minMark: 50, scoredMark: '', creditMark: '', result: 'Auto calculated' }
    ])
  }

  const handleRemoveRow = (idx) => {
    if (marks.length === 1) {
      toast.error('At least one coursework row is required')
      return
    }
    setMarks(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Coursework details saved successfully!')
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

        {/* Mark Entry Card */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Mark Entry</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enter exam date, marks scored, and credits for coursework subjects.</div>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                style={{
                  padding: '7px 14px',
                  background: 'linear-gradient(90deg, #4F46E5, #6C63FF)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ➕ Add Subject Row
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>SUBJECT NAME</th>
                    <th>EXAM DATE</th>
                    <th>MAX MARK</th>
                    <th>MIN MARK</th>
                    <th>SCORED MARK</th>
                    <th>CREDIT MARK</th>
                    <th>RESULT</th>
                    <th style={{ width: '50px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={m.subject}
                          onChange={e => handleMarkChange(i, 'subject', e.target.value)}
                          placeholder="Enter Subject Name & Code"
                          style={{ width: '100%', minWidth: '220px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={m.examDate}
                          onChange={e => handleMarkChange(i, 'examDate', e.target.value)}
                          style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px', width: '130px' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{m.maxMark}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{m.minMark}</td>
                      <td>
                        <input
                          type="text"
                          value={m.scoredMark}
                          onChange={e => handleMarkChange(i, 'scoredMark', e.target.value)}
                          placeholder="Enter Mark"
                          style={{ width: '90px', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={m.creditMark}
                          onChange={e => handleMarkChange(i, 'creditMark', e.target.value)}
                          placeholder="Enter Credit"
                          style={{ width: '90px', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}
                        />
                      </td>
                      <td>
                        <span style={{ fontSize: '11.5px', color: '#6C63FF', fontStyle: 'italic' }}>
                          {m.scoredMark ? (Number(m.scoredMark) >= m.minMark ? '✅ PASS' : '❌ FAIL') : m.result}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(i)}
                          title="Remove Subject Row"
                          style={{
                            padding: '4px 8px',
                            background: '#FEE2E2',
                            color: '#EF4444',
                            border: '1px solid #FCA5A5',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          🗑️
                        </button>
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
