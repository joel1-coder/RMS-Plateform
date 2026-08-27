import { useState } from 'react'
import toast from 'react-hot-toast'

const designationOptions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Reader', 'Lecturer']
const reasonOptions = ['Expertise Area', 'Mutual Agreement', 'Administrative', 'Other']

export default function AddCoSupervisor() {
  const [scholar] = useState({
    name: 'Miss / Mrs. VANI K',
    regNo: 'BDU2020410331',
  })

  const [form, setForm] = useState({
    printProforma: false,
    nameOfCoSupervisor: '',
    designationOfCoSupervisor: '',
    mobileNo: '',
    emailId: '',
    nameOfCentre: '',
    servingInstitution: '',
    dateOfSuperannuation: '',
    proformaNomination: null,
    coSupervisorWillingness: null,
    reason: '',
    enterReason: '',
    scholarCount: 0,
    scholarDetails: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Co-Supervisor nomination saved successfully!')
    setSubmitting(false)
  }

  const FileSelect = ({ label, fileKey }) => (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>{label}</label>
      <label style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '7px 14px', background: '#F1F5F9', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)',
      }}>
        Select
        <input type="file" style={{ display: 'none' }} onChange={e => handleChange(fileKey, e.target.files[0])} />
      </label>
      {form[fileKey] && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#1E7D45' }}>Selected: {form[fileKey].name}</span>}
    </div>
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Add Co-Supervisor</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Nominate co-supervisors for scholars under supervision
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Scholar Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #1E7D45, #166A3A)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '14px' }} />
          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>Add Co-Supervisor - Miss / Mrs. VANI K [BDU2020410331]</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body">
              {/* Print Proforma */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input type="checkbox" checked={form.printProforma} onChange={e => handleChange('printProforma', e.target.checked)} />
                  Print Proforma
                </label>
                <button type="button" style={{ padding: '6px 14px', background: 'linear-gradient(90deg,#174EA6,#0A2A66)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  Proforma
                </button>
                <button type="button" className="btn btn-ghost btn-sm">Get signature from the authority</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Name of Co-Supervisor *', key: 'nameOfCoSupervisor', placeholder: '' },
                  { label: 'Designation of Co-Supervisor *', key: 'designationOfCoSupervisor', type: 'select', options: designationOptions },
                  { label: 'Mobile No.', key: 'mobileNo', placeholder: '' },
                  { label: 'Email ID', key: 'emailId', placeholder: '' },
                  { label: 'Name of Centre', key: 'nameOfCentre', placeholder: '' },
                  { label: 'Serving Institution', key: 'servingInstitution', placeholder: '' },
                  { label: 'Date of Superannuation', key: 'dateOfSuperannuation', type: 'date' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{field.label}</label>
                    {field.type === 'select' ? (
                      <select value={form[field.key]} onChange={e => handleChange(field.key, e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
                        <option value="">Select</option>
                        {field.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={field.type || 'text'} value={form[field.key]} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder}
                        style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', boxSizing: 'border-box' }} />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <FileSelect label="Proforma Nomination of Co-Guide *" fileKey="proformaNomination" />
                <FileSelect label="Co-Supervisor Willingness Certificate *" fileKey="coSupervisorWillingness" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Scholar Count</label>
                  <input type="number" value={form.scholarCount} onChange={e => handleChange('scholarCount', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ gridColumn: '2 / -1' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Scholar Details</label>
                  <textarea value={form.scholarDetails} onChange={e => handleChange('scholarDetails', e.target.value)} rows={3}
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Reason *</label>
                  <select value={form.reason} onChange={e => handleChange('reason', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff' }}>
                    <option value="">Select</option>
                    {reasonOptions.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                {form.reason === 'Other' && (
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Enter Reason (if others) *</label>
                    <input value={form.enterReason} onChange={e => handleChange('enterReason', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', boxSizing: 'border-box' }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost">CANCEL</button>
            <button type="submit" disabled={submitting}
              style={{
                padding: '10px 28px', background: 'linear-gradient(90deg,#1E7D45,#166A3A)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '13.5px',
                cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(30,125,69,0.3)',
              }}>
              {submitting ? 'Saving...' : 'SAVE NOMINATION'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          2024 Research Section Management
        </div>
      </div>
    </div>
  )
}
