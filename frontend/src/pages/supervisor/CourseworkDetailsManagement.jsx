import { useState } from 'react'
import toast from 'react-hot-toast'

const scholarDetails = {
  regNo: 'VANI K [BDU2020410331] | COMPUTER SCIENCE - FACULTY OF SCIENCE',
}

export default function CourseworkDetailsManagement() {
  const [marks, setMarks] = useState([
    { subject: 'RESEARCH METHODOLOGY [JOHPHCS001]', coursework: 'Research Methodology', examDate: '', maxMark: 100, internal: '', external: '', eScript: '', creditMark: '', result: 'Auto calculated' },
    { subject: 'ADVANCED COMPUTER SCIENCE [JOHPHCS002]', coursework: 'Core Course', examDate: '', maxMark: 100, internal: '', external: '', eScript: '', creditMark: '', result: 'Auto calculated' },
    { subject: 'CLOUD COMPUTING [JOHPHCS0011]', coursework: 'Elective Course', examDate: '', maxMark: 100, internal: '', external: '', eScript: '', creditMark: '', result: 'Auto calculated' },
    { subject: 'ELECTIVE / SPECIAL PAPER [JOHPHCS0012]', coursework: 'Special Paper', examDate: '', maxMark: 100, internal: '', external: '', eScript: '', creditMark: '', result: 'Auto calculated' },
  ])
  const [saving, setSaving] = useState(false)

  const handleMarkChange = (idx, key, val) => {
    setMarks(prev => prev.map((m, i) => i === idx ? { ...m, [key]: val } : m))
  }

  const handleAddRow = () => {
    setMarks(prev => [
      ...prev,
      { subject: '', coursework: 'Core Course', examDate: '', maxMark: 100, internal: '', external: '', eScript: '', creditMark: '', result: 'Auto calculated' }
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
          Coursework Mark Entry
        </div>

        {/* Scholar Header */}
        <div style={{
          background: 'linear-gradient(90deg, #0A2A66, #174EA6)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '20px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>
            View / Add Coursework Details - {scholarDetails.regNo}
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
                  background: 'linear-gradient(90deg, #0A2A66, #174EA6)',
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
                Add Subject Row
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>SUBJECT NAME</th>
                    <th>COURSE-WORK</th>
                    <th>EXAM DATE</th>
                    <th>MAX MARK</th>
                    <th>INTERNAL</th>
                    <th>EXTERNAL</th>
                    <th>E-SCRIPT</th>
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
                          style={{ width: '100%', minWidth: '200px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px' }}
                        />
                      </td>
                      <td>
                        <select
                          value={m.coursework}
                          onChange={e => handleMarkChange(i, 'coursework', e.target.value)}
                          style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', width: '160px' }}
                        >
                          <option value="Core Course">Core Course</option>
                          <option value="Elective Course">Elective Course</option>
                          <option value="Research Methodology">Research Methodology</option>
                          <option value="Special Paper">Special Paper</option>
                        </select>
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
                      <td>
                        <input
                          type="text"
                          value={m.internal}
                          onChange={e => handleMarkChange(i, 'internal', e.target.value)}
                          placeholder="Enter Internal"
                          style={{ width: '90px', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={m.external}
                          onChange={e => handleMarkChange(i, 'external', e.target.value)}
                          placeholder="Enter External"
                          style={{ width: '90px', padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {m.eScript ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#E7F4EC', border: '1px solid #B6D9C4', padding: '4px 8px', borderRadius: '4px', maxWidth: '140px' }}>
                              <span style={{ fontSize: '11px', color: '#166A3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.eScript}>
                                {m.eScript}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleMarkChange(i, 'eScript', '')}
                                style={{ background: 'none', border: 'none', color: '#1E7D45', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <>
                              <label
                                htmlFor={`escript-file-${i}`}
                                style={{
                                  padding: '5px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB',
                                  borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                                }}
                              >
                                Upload
                              </label>
                              <input
                                id={`escript-file-${i}`}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={e => {
                                  if (e.target.files?.[0]) {
                                    handleMarkChange(i, 'eScript', e.target.files[0].name)
                                    toast.success(`E-Script uploaded for row ${i + 1}`)
                                  }
                                }}
                              />
                            </>
                          )}
                        </div>
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
                        <span style={{ fontSize: '11.5px', color: '#174EA6', fontStyle: 'italic', fontWeight: 700 }}>
                          {(() => {
                            const hasMarks = m.internal !== '' || m.external !== '';
                            if (!hasMarks) return m.result;
                            const total = (Number(m.internal) || 0) + (Number(m.external) || 0);
                            return total >= 50 ? 'PASS' : 'FAIL';
                          })()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(i)}
                          title="Remove Subject Row"
                          style={{
                            padding: '4px 8px',
                            background: '#F9E6E8',
                            color: '#B4232A',
                            border: '1px solid #F0B9BD',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          Delete
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
              padding: '10px 28px', background: 'linear-gradient(90deg,#0A2A66,#174EA6)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '13.5px',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(23,78,166,0.28)',
            }}>
            {saving ? 'Saving...' : 'Save Details'}
          </button>
        </div>
      </div>
    </div>
  )
}
