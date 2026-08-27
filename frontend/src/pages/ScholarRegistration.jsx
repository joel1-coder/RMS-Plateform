import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import toast from 'react-hot-toast'

/* -- Design tokens -- */
const C = {
  maroon: '#0A2A66',
  maroonDeep: '#061B44',
  gold: '#C89B1E',
  goldLight: '#FFF6D8',
  paper: '#F3F7FF',
  paperDeep: '#E8EEF8',
  ink: '#1E293B',
  inkSoft: '#64748B',
  line: '#E2E8F0',
  error: '#B4232A',
  good: '#1E7D45',
}

const STEPS = [
  { id: 'personal',    label: 'Personal Details',    icon: '' },
  { id: 'address',     label: 'Address',              icon: '' },
  { id: 'academic',    label: 'Academic Details',     icon: '' },
  { id: 'research',    label: 'Research Details',     icon: '' },
  { id: 'supervisor',  label: 'Supervisor Details',   icon: '' },
  { id: 'review',      label: 'Review & Submit',      icon: '' },
]

const initialForm = {
  // Personal
  name: '', dob: '', gender: '', nationality: 'Indian',
  email: '', phone: '', aadhaar: '', category: '',
  // Address
  address: '', city: '', state: '', pincode: '',
  permanentAddress: '', sameAsPresent: false,
  // Academic
  regNo: '', dept: '', batch: '', qualification: '',
  institution: '', percentage: '', experience: '',
  // Research
  researchTitle: '', area: '', keywords: '', objectives: '',
  // Supervisor (read-only from account data)
  supervisorName: '', coSupervisor: '',
}

function Field({ label, required, children, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 700,
        color: C.inkSoft, textTransform: 'uppercase', letterSpacing: '0.5px',
        marginBottom: 6,
      }}>
        {label}{required && <span style={{ color: C.error }}> *</span>}
      </label>
      {children}
      {error && <p style={{ color: C.error, fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', disabled, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      {...rest}
      style={{
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${C.line}`,
        borderRadius: 8, background: disabled ? C.paperDeep : '#fff',
        color: C.ink, fontSize: 14, outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        ...(rest.style || {}),
      }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = C.maroon }}
      onBlur={e => { e.target.style.borderColor = C.line }}
    />
  )
}

function Select({ value, onChange, children, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${C.line}`,
        borderRadius: 8, background: disabled ? C.paperDeep : '#fff',
        color: value ? C.ink : C.inkSoft, fontSize: 14, outline: 'none',
        boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </select>
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${C.line}`,
        borderRadius: 8, background: '#fff', color: C.ink,
        fontSize: 14, outline: 'none', resize: 'vertical',
        boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => { e.target.style.borderColor = C.maroon }}
      onBlur={e => { e.target.style.borderColor = C.line }}
    />
  )
}

function Grid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
      {children}
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <div style={{
      fontSize: 15, fontWeight: 700, color: C.maroon,
      borderBottom: `2px solid ${C.gold}`,
      paddingBottom: 8, marginBottom: 20,
    }}>
      {children}
    </div>
  )
}

/* -- Step Panels -- */
function StepPersonal({ form, setForm }) {
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <>
      <SectionHeading> Personal Information</SectionHeading>
      <Grid>
        <Field label="Full Name" required>
          <Input value={form.name} onChange={e => u('name', e.target.value)} placeholder="As per official documents" />
        </Field>
        <Field label="Date of Birth" required>
          <Input type="date" value={form.dob} onChange={e => u('dob', e.target.value)} />
        </Field>
        <Field label="Gender" required>
          <Select value={form.gender} onChange={e => u('gender', e.target.value)}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Transgender</option>
            <option>Prefer not to say</option>
          </Select>
        </Field>
        <Field label="Nationality" required>
          <Input value={form.nationality} onChange={e => u('nationality', e.target.value)} placeholder="e.g. Indian" />
        </Field>
        <Field label="Email Address" required>
          <Input type="email" value={form.email} onChange={e => u('email', e.target.value)} placeholder="Official email" />
        </Field>
        <Field label="Phone Number" required>
          <Input type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="10-digit mobile number" />
        </Field>
        <Field label="Aadhaar Number">
          <Input value={form.aadhaar} onChange={e => u('aadhaar', e.target.value)} placeholder="12-digit Aadhaar" />
        </Field>
        <Field label="Category" required>
          <Select value={form.category} onChange={e => u('category', e.target.value)}>
            <option value="">Select Category</option>
            <option>General</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
            <option>EWS</option>
            <option>PWD</option>
          </Select>
        </Field>
      </Grid>
    </>
  )
}

function StepAddress({ form, setForm }) {
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSameCheck = (checked) => {
    setForm(f => ({
      ...f,
      sameAsPresent: checked,
      permanentAddress: checked ? f.address : f.permanentAddress,
    }))
  }

  return (
    <>
      <SectionHeading> Address Details</SectionHeading>
      <Field label="Present Address" required>
        <Textarea value={form.address} onChange={e => u('address', e.target.value)} placeholder="Door No, Street, Area" rows={2} />
      </Field>
      <Grid>
        <Field label="City / Town" required>
          <Input value={form.city} onChange={e => u('city', e.target.value)} placeholder="City" />
        </Field>
        <Field label="State" required>
          <Select value={form.state} onChange={e => u('state', e.target.value)}>
            <option value="">Select State</option>
            {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh'].map(s => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="PIN Code" required>
          <Input value={form.pincode} onChange={e => u('pincode', e.target.value)} placeholder="6-digit PIN" />
        </Field>
      </Grid>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 14px' }}>
        <input
          type="checkbox"
          id="same-addr"
          checked={form.sameAsPresent}
          onChange={e => handleSameCheck(e.target.checked)}
          style={{ accentColor: C.maroon, width: 16, height: 16 }}
        />
        <label htmlFor="same-addr" style={{ fontSize: 13, color: C.inkSoft, cursor: 'pointer' }}>
          Permanent address is same as present address
        </label>
      </div>

      <Field label="Permanent Address" required>
        <Textarea
          value={form.sameAsPresent ? form.address : form.permanentAddress}
          onChange={e => u('permanentAddress', e.target.value)}
          placeholder="Permanent Address"
          rows={2}
        />
      </Field>
    </>
  )
}

function StepAcademic({ form, setForm }) {
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <>
      <SectionHeading> Academic Details</SectionHeading>
      <Grid>
        <Field label="Registration Number" required>
          <Input value={form.regNo} onChange={e => u('regNo', e.target.value)} placeholder="e.g. CS/2024/001" />
        </Field>
        <Field label="Department" required>
          <Input value={form.dept} onChange={e => u('dept', e.target.value)} placeholder="e.g. Computer Science" />
        </Field>
        <Field label="Batch Year" required>
          <Select value={form.batch} onChange={e => u('batch', e.target.value)}>
            <option value="">Select Batch</option>
            {[2020,2021,2022,2023,2024,2025,2026].map(y => <option key={y}>{y}</option>)}
          </Select>
        </Field>
        <Field label="Highest Qualification" required>
          <Select value={form.qualification} onChange={e => u('qualification', e.target.value)}>
            <option value="">Select Qualification</option>
            <option>B.E / B.Tech</option>
            <option>M.E / M.Tech</option>
            <option>M.Sc</option>
            <option>M.Phil</option>
            <option>MBA</option>
            <option>MCA</option>
            <option>Other PG</option>
          </Select>
        </Field>
        <Field label="Institution" required>
          <Input value={form.institution} onChange={e => u('institution', e.target.value)} placeholder="Name of Institution / University" />
        </Field>
        <Field label="Percentage / CGPA" required>
          <Input value={form.percentage} onChange={e => u('percentage', e.target.value)} placeholder="e.g. 85% or 8.5 CGPA" />
        </Field>
      </Grid>
      <Field label="Prior Research / Work Experience">
        <Textarea value={form.experience} onChange={e => u('experience', e.target.value)} placeholder="Briefly describe any prior research, work, or academic experience" rows={3} />
      </Field>
    </>
  )
}

function StepResearch({ form, setForm }) {
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <>
      <SectionHeading> Research Details</SectionHeading>
      <Field label="Proposed Research Title" required>
        <Input value={form.researchTitle} onChange={e => u('researchTitle', e.target.value)} placeholder="Title of your proposed research" />
      </Field>
      <Grid>
        <Field label="Research Area / Domain" required>
          <Input value={form.area} onChange={e => u('area', e.target.value)} placeholder="e.g. Machine Learning, VLSI, Bioinformatics" />
        </Field>
        <Field label="Keywords">
          <Input value={form.keywords} onChange={e => u('keywords', e.target.value)} placeholder="Comma-separated keywords" />
        </Field>
      </Grid>
      <Field label="Research Objectives / Problem Statement">
        <Textarea value={form.objectives} onChange={e => u('objectives', e.target.value)} placeholder="Briefly describe your research objectives or problem statement" rows={4} />
      </Field>
    </>
  )
}

function StepSupervisor({ form, setForm, user }) {
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <>
      <SectionHeading> Supervisor Details</SectionHeading>
      <Grid>
        <Field label="Assigned Supervisor">
          <Input
            value={user?.assignedSupervisor || form.supervisorName || ''}
            onChange={e => u('supervisorName', e.target.value)}
            placeholder="Supervisor Name"
            disabled={!!user?.assignedSupervisor}
          />
        </Field>
        <Field label="Co-Supervisor (if any)">
          <Input value={form.coSupervisor} onChange={e => u('coSupervisor', e.target.value)} placeholder="Co-Supervisor Name (optional)" />
        </Field>
      </Grid>
      {user?.assignedSupervisor && (
        <div style={{
          background: '#E7F4EC', border: '1px solid #B8DFC6',
          borderRadius: 8, padding: '10px 14px', fontSize: 13,
          color: '#166A3A', marginTop: 8,
        }}>
          Info Your supervisor has been auto-filled based on your account allocation.
        </div>
      )}
    </>
  )
}

/* -- Review Step -- */
function ReviewItem({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13 }}>
      <span style={{ color: C.inkSoft, fontWeight: 600, minWidth: 160 }}>{label}:</span>
      <span style={{ color: C.ink }}>{value || <span style={{ color: '#aaa' }}>-</span>}</span>
    </div>
  )
}

function StepReview({ form, user }) {
  return (
    <>
      <SectionHeading> Review Your Submission</SectionHeading>
      <p style={{ fontSize: 13, color: C.inkSoft, marginBottom: 20 }}>
        Please review all the information below before submitting. Once submitted, the Admin will review and approve your registration.
      </p>

      <div style={{ background: C.paper, borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.maroon, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Personal</div>
        <ReviewItem label="Full Name" value={form.name} />
        <ReviewItem label="Date of Birth" value={form.dob} />
        <ReviewItem label="Gender" value={form.gender} />
        <ReviewItem label="Email" value={form.email} />
        <ReviewItem label="Phone" value={form.phone} />
        <ReviewItem label="Category" value={form.category} />
      </div>

      <div style={{ background: C.paper, borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.maroon, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Address</div>
        <ReviewItem label="Present Address" value={`${form.address}, ${form.city}, ${form.state} - ${form.pincode}`} />
        <ReviewItem label="Permanent Address" value={form.sameAsPresent ? 'Same as present' : form.permanentAddress} />
      </div>

      <div style={{ background: C.paper, borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.maroon, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Academic</div>
        <ReviewItem label="Registration No." value={form.regNo} />
        <ReviewItem label="Department" value={form.dept} />
        <ReviewItem label="Batch" value={form.batch} />
        <ReviewItem label="Qualification" value={form.qualification} />
        <ReviewItem label="Institution" value={form.institution} />
      </div>

      <div style={{ background: C.paper, borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.maroon, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Research</div>
        <ReviewItem label="Research Title" value={form.researchTitle} />
        <ReviewItem label="Research Area" value={form.area} />
        <ReviewItem label="Keywords" value={form.keywords} />
      </div>

      <div style={{ background: C.paper, borderRadius: 10, padding: '16px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.maroon, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Supervisor</div>
        <ReviewItem label="Supervisor" value={user?.assignedSupervisor || form.supervisorName} />
        <ReviewItem label="Co-Supervisor" value={form.coSupervisor} />
      </div>
    </>
  )
}

/* -- Status Screen (after submission) -- */
function StatusScreen({ status, rejectionReason, onLogout }) {
  if (status === 'Pending') return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}></div>
      <h2 style={{ color: C.maroon, margin: '0 0 10px' }}>Registration Submitted!</h2>
      <p style={{ color: C.inkSoft, maxWidth: 420, margin: '0 auto 30px', lineHeight: 1.6 }}>
        Your registration form has been sent to the Admin for review. You will be notified once it is approved.
      </p>
      <div style={{
        background: '#FFF6D8', border: '1px solid #F6D860',
        borderRadius: 10, padding: '14px 20px',
        display: 'inline-block', textAlign: 'left', marginBottom: 30,
      }}>
        <div style={{ fontSize: 13, color: '#936C00', fontWeight: 600, marginBottom: 4 }}>What happens next?</div>
        <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13, color: '#936C00', lineHeight: 2 }}>
          <li>Admin reviews your submission</li>
          <li>Admin approves and generates your admission letter</li>
          <li>You receive your official scholar account credentials</li>
        </ul>
      </div>
      <br />
      <button onClick={onLogout} style={{
        padding: '10px 28px', background: C.maroon,
        color: '#fff', border: 'none', borderRadius: 8,
        fontWeight: 600, fontSize: 14, cursor: 'pointer',
      }}>
        Logout
      </button>
    </div>
  )

  if (status === 'Approved') return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}></div>
      <h2 style={{ color: C.good, margin: '0 0 10px' }}>Registration Approved!</h2>
      <p style={{ color: C.inkSoft, maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
        Congratulations! Your PhD registration has been officially approved. You can now download your admission document.
      </p>
      <button onClick={onLogout} style={{
        padding: '10px 28px', background: C.inkSoft,
        color: '#fff', border: 'none', borderRadius: 8,
        fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 10,
      }}>
        Logout
      </button>
    </div>
  )

  if (status === 'Rejected') return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}></div>
      <h2 style={{ color: C.error, margin: '0 0 10px' }}>Registration Not Accepted</h2>
      {rejectionReason && (
        <div style={{
          background: '#F9E6E8', border: '1px solid #F0B9BD',
          borderRadius: 10, padding: '14px 20px', maxWidth: 420,
          margin: '0 auto 20px', textAlign: 'left',
        }}>
          <div style={{ fontWeight: 600, color: '#9F1E24', marginBottom: 4 }}>Reason:</div>
          <div style={{ color: '#9F1E24', fontSize: 14 }}>{rejectionReason}</div>
        </div>
      )}
      <p style={{ color: C.inkSoft, marginBottom: 20 }}>Please contact the Admin for further assistance.</p>
      <button onClick={onLogout} style={{
        padding: '10px 28px', background: C.maroon,
        color: '#fff', border: 'none', borderRadius: 8,
        fontWeight: 600, fontSize: 14, cursor: 'pointer',
      }}>
        Logout
      </button>
    </div>
  )

  return null
}

/* -- Main Component -- */
export default function ScholarRegistration() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState(null) // null | 'Pending' | 'Approved' | 'Rejected'
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(true)

  // If not a test account user, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    if (!user.isTestAccount) {
      // Not a test account - send to their actual portal
      navigate(`/${user.role?.toLowerCase() || 'login'}`, { replace: true })
      return
    }

    // Pre-fill from user context
    setForm(f => ({
      ...f,
      name: user.name || '',
      email: user.email || '',
      dept: user.dept || '',
      supervisorName: user.assignedSupervisor || '',
    }))

    // Fetch existing submission if any
    fetchMyRegistration()
  }, [user])

  const fetchMyRegistration = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('rms_token')
      const res = await apiFetch('/api/test-accounts/my-registration', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data?.data) {
        setSubmissionStatus(data.data.status)
        setRejectionReason(data.data.rejectionReason || '')
        if (data.data.formData) {
          setForm(f => ({ ...f, ...data.data.formData }))
        }
      }
    } catch {
      // No submission yet
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const validateStep = () => {
    if (step === 0) {
      if (!form.name || !form.dob || !form.gender || !form.email || !form.phone || !form.category) {
        toast.error('Please fill all required fields in Personal Details')
        return false
      }
    }
    if (step === 1) {
      if (!form.address || !form.city || !form.state || !form.pincode) {
        toast.error('Please fill all required address fields')
        return false
      }
    }
    if (step === 2) {
      if (!form.regNo || !form.dept || !form.batch || !form.qualification || !form.institution || !form.percentage) {
        toast.error('Please fill all required academic fields')
        return false
      }
    }
    if (step === 3) {
      if (!form.researchTitle || !form.area) {
        toast.error('Please fill in at least the Research Title and Area')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const token = localStorage.getItem('rms_token')
      const res = await apiFetch('/api/test-accounts/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testAccountId: user.testAccountId,
          formData: {
            ...form,
            supervisorName: user.assignedSupervisor || form.supervisorName,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed')
      toast.success('Registration submitted successfully!')
      setSubmissionStatus('Pending')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.paper,
      }}>
        <div style={{ fontSize: 14, color: C.inkSoft }}>Loading your registration...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: `linear-gradient(135deg, ${C.maroonDeep} 0%, ${C.maroon} 62%, #174EA6 100%)`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)',
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: '#fff',
          }}>R</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Research Management System</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>PhD Scholar Registration</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user && (
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
               {user.name}
            </div>
          )}
          <button onClick={handleLogout} style={{
            padding: '7px 16px', background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, color: '#fff', fontSize: 13,
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '32px 16px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 760 }}>

          {/* If already submitted, show status screen */}
          {submissionStatus ? (
            <div style={{
              background: '#fff', borderRadius: 20, boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}>
              <StatusScreen
                status={submissionStatus}
                rejectionReason={rejectionReason}
                onLogout={handleLogout}
              />
            </div>
          ) : (
            <>
              {/* Step Progress */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                  PhD Scholar Registration Form
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 20 }}>
                  Fill in all details carefully. These will be reviewed by the Admin.
                </div>

                {/* Step Indicators */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STEPS.map((s, i) => (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 20,
                      background: i === step
                        ? C.gold
                        : i < step
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(255,255,255,0.08)',
                      color: i === step ? '#fff' : i < step ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)',
                      fontSize: 12, fontWeight: i === step ? 700 : 500,
                      transition: 'all 0.3s',
                      cursor: i < step ? 'pointer' : 'default',
                    }}
                    onClick={() => { if (i < step) setStep(i) }}
                    >
                      <span>{i < step ? '' : s.icon}</span>
                      <span style={{ display: window.innerWidth < 500 ? 'none' : 'inline' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Card */}
              <div style={{
                background: '#fff', borderRadius: 20,
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
              }}>
                <div style={{
                  background: C.paper, borderBottom: `1px solid ${C.line}`,
                  padding: '18px 28px',
                }}>
                  <div style={{ fontSize: 12, color: C.inkSoft }}>Step {step + 1} of {STEPS.length}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.maroon }}>
                    {STEPS[step].icon} {STEPS[step].label}
                  </div>
                </div>

                <div style={{ padding: '28px 28px 10px' }}>
                  {step === 0 && <StepPersonal form={form} setForm={setForm} />}
                  {step === 1 && <StepAddress form={form} setForm={setForm} />}
                  {step === 2 && <StepAcademic form={form} setForm={setForm} />}
                  {step === 3 && <StepResearch form={form} setForm={setForm} />}
                  {step === 4 && <StepSupervisor form={form} setForm={setForm} user={user} />}
                  {step === 5 && <StepReview form={form} user={user} />}
                </div>

                {/* Navigation */}
                <div style={{
                  padding: '18px 28px 28px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: `1px solid ${C.line}`,
                }}>
                  <button
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 0}
                    style={{
                      padding: '10px 22px', borderRadius: 8,
                      border: `1.5px solid ${C.line}`, background: 'transparent',
                      color: step === 0 ? '#ccc' : C.ink, fontWeight: 600,
                      fontSize: 14, cursor: step === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                     Previous
                  </button>

                  {/* Progress bar */}
                  <div style={{ flex: 1, margin: '0 20px', height: 5, background: C.line, borderRadius: 9 }}>
                    <div style={{
                      height: '100%', borderRadius: 9,
                      background: `linear-gradient(90deg, ${C.maroon}, ${C.gold})`,
                      width: `${((step + 1) / STEPS.length) * 100}%`,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>

                  {step < STEPS.length - 1 ? (
                    <button
                      onClick={handleNext}
                      style={{
                        padding: '10px 22px', borderRadius: 8,
                        border: 'none',
                        background: `linear-gradient(135deg, ${C.maroon}, ${C.maroonDeep})`,
                        color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      }}
                    >
                      Next 
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{
                        padding: '10px 24px', borderRadius: 8,
                        border: 'none',
                        background: submitting ? '#aaa' : `linear-gradient(135deg, ${C.good}, #166A3A)`,
                        color: '#fff', fontWeight: 700, fontSize: 14,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      {submitting ? 'Submitting...' : ' Submit Registration'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
