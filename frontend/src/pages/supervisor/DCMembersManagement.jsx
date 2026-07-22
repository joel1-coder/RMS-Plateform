import { useState } from 'react'
import toast from 'react-hot-toast'

const INITIAL_MEMBER = {
  name: '',
  idDesignation: '',
  gender: '',
  category: '',
  department: '',
  collegeInstitution: '',
  pincode: '',
  city: '',
  email: '',
  mobile: '',
  recognitionLetter: null,
}

const genderOptions = ['Male', 'Female', 'Other']
const categoryOptions = ['Associate Professor', 'Assistant Professor', 'Professor', 'Reader']

export default function DCMembersManagement() {
  const [scholar, setScholar] = useState({
    regNo: 'BDU2020410504',
    name: 'Miss / Mrs. BHUVANESHWARI A',
    status: 'APPROVED',
  })
  const [member1, setMember1] = useState({ ...INITIAL_MEMBER, name: 'DEIVANAYAGAM J G R', idDesignation: '8415', gender: 'Male', category: 'Associate Professor', department: 'DEPARTMENT OF COMPUTER SCIENCE', collegeInstitution: 'BISHOP HEBER COLLEGE,AUTONOMOUS', pincode: 'Tiruchirappalli', city: '620017', email: 'bm2@gmail.com', mobile: '9894033176' })
  const [member2, setMember2] = useState({ ...INITIAL_MEMBER, name: 'HARI GANESH S', idDesignation: '9476', gender: 'Male', category: 'Assistant Professor', department: 'DEPARTMENT OF COMPUTER SCIENCE', collegeInstitution: 'H.H. THE RAJA\'S COLLEGE (AUTONOMOUS)', pincode: 'Tiruchirappalli', city: '622001', email: 'brittokk@gmail.com', mobile: '9994058416' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('DC Constitution submitted successfully!')
    setSubmitting(false)
  }

  const InfoBanner = () => (
    <div style={{
      background: '#FFF7ED', border: '1px solid #FED7AA',
      borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <span style={{ color: '#F59E0B', fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
        <div style={{ fontSize: '12.5px', color: '#92400E', lineHeight: 1.6 }}>
          <strong>Important Note:</strong><br />
          Once the candidate has paid their one-time fee to the University, the DC Constitution will be processed only after the said payment is done.<br />
          File attach attachment is required for the cases the DC Members nominated after the Bharathidasan University.
        </div>
      </div>
    </div>
  )

  const MemberForm = ({ title, data, onChange }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        background: 'linear-gradient(90deg, #4F46E5, #6C63FF)',
        color: '#fff', padding: '10px 16px', borderRadius: 'var(--radius-sm)',
        fontWeight: 700, fontSize: '13px', marginBottom: '16px',
      }}>
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { label: 'NAME', key: 'name', full: false },
          { label: 'ID (DESIGNATION)', key: 'idDesignation', full: false },
          { label: 'GENDER', key: 'gender', type: 'select', options: genderOptions },
          { label: 'CATEGORY', key: 'category', type: 'select', options: categoryOptions },
          { label: 'DEPARTMENT', key: 'department', full: true },
          { label: 'COLLEGE / INSTITUTION', key: 'collegeInstitution', full: true },
          { label: 'PIN CODE', key: 'pincode', full: false },
          { label: 'CITY', key: 'city', full: false },
          { label: 'EMAIL', key: 'email', full: false },
          { label: 'MOBILE', key: 'mobile', full: false },
        ].map(field => (
          <div key={field.key} style={{ gridColumn: field.full ? '1 / -1' : 'auto' }}>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                value={data[field.key]}
                onChange={e => onChange(field.key, e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', background: '#fff', color: 'var(--text-primary)' }}
              >
                <option value="">Select</option>
                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type="text"
                value={data[field.key]}
                onChange={e => onChange(field.key, e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', color: 'var(--text-primary)', background: '#fff', boxSizing: 'border-box' }}
              />
            )}
          </div>
        ))}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>RECOGNITION LETTER</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', background: '#F1F5F9', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)',
            }}>
              📎 Select File
              <input type="file" style={{ display: 'none' }} onChange={e => onChange('recognitionLetter', e.target.files[0])} />
            </label>
            {data.recognitionLetter && <span style={{ fontSize: '11px', color: '#10B981' }}>✓ {data.recognitionLetter.name}</span>}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="animate-fade">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">DC Members Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Add and manage Doctoral Committee members
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Scholar Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #7C3AED 0%, #4F46E5 100%)',
          borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>DC Member – Miss / Mrs.</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>{scholar.name} [{scholar.regNo}]</div>
          </div>
          <span style={{ background: '#10B981', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '99px' }}>{scholar.status}</span>
        </div>

        <InfoBanner />

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body" style={{ display: 'flex', gap: '28px' }}>
              <MemberForm
                title="DC Member 1 *"
                data={member1}
                onChange={(key, val) => setMember1(prev => ({ ...prev, [key]: val }))}
              />
              <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
              <MemberForm
                title="DC Member 2 *"
                data={member2}
                onChange={(key, val) => setMember2(prev => ({ ...prev, [key]: val }))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 40px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(90deg, #7C3AED, #4F46E5)',
                color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s',
                boxShadow: '0 4px 14px rgba(108,99,255,0.4)',
              }}
            >
              {submitting ? '⏳ Submitting...' : '✅ Submit DC Constitution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
