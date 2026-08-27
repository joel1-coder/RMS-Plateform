import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { apiFetch } from '../utils/api'

const ROLES = [
  { id: 'admin', label: 'Admin' },
  { id: 'supervisor', label: 'Supervisor' },
  { id: 'scholar', label: 'Scholar' },
  { id: 'hod', label: 'HOD' },
  { id: 'drc', label: 'DRC' },
  { id: 'librarian', label: 'Librarian' },
]

// Default fallback credentials per role
const DEFAULT_CREDENTIALS = {
  admin:      { email: 'admin@rms.edu',      password: 'admin123',      name: 'Dr. Admin Singh',    role: 'admin',      department: 'Administration' },
  supervisor: { email: 'supervisor@rms.edu', password: 'super123',      name: 'Dr. Priya Kumar',    role: 'supervisor', department: 'Computer Science' },
  scholar:    { email: 'scholar@rms.edu',    password: 'scholar123',    name: 'Rahul Sharma',       role: 'scholar',    department: 'Computer Science' },
  hod:        { email: 'hod@rms.edu',        password: 'hod123',        name: 'Prof. Anita Verma',  role: 'hod',        department: 'Computer Science' },
  drc:        { email: 'drc@rms.edu',        password: 'drc123',        name: 'Dr. Mohan Reddy',    role: 'drc',        department: 'Research Committee' },
  librarian:  { email: 'librarian@rms.edu',  password: 'library123',    name: 'Ms. Deepa Nair',     role: 'librarian',  department: 'Central Library' },
}

function getEmailForRole(roleId) {
  try {
    const users = JSON.parse(localStorage.getItem('rms_all_users') || '[]')
    const match = users.find(u => u.role && u.role.toLowerCase() === roleId.toLowerCase() && u.status === 'Active')
    return match ? match.email : ''
  } catch {
    return ''
  }
}

/* ─── Test Login Modal ──────────────────────────────────────────── */
function TestLoginModal({ onClose, onSuccess }) {
  const [testId, setTestId] = useState('')
  const [testPassword, setTestPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!testId.trim() || !testPassword.trim()) {
      toast.error('Please enter both Test ID and Password')
      return
    }
    setLoading(true)
    try {
      let response
      try {
        response = await apiFetch('/api/test-accounts/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testId: testId.trim(), testPassword: testPassword.trim() }),
        })
      } catch {
        throw new Error('Cannot connect to server. Please check your internet connection.')
      }

      let data = {}
      try { data = await response.json() } catch {
        throw new Error('Server returned an invalid response.')
      }

      if (!response.ok) throw new Error(data.message || 'Invalid Test ID or Password')

      onSuccess(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        animation: 'slideUp 0.25s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2540 100%)',
          padding: '24px 28px 20px',
          position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: '50%', width: '32px', height: '32px',
            color: '#fff', fontSize: '16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
            }}>🧪</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '18px', lineHeight: 1.2 }}>
                Test Account Login
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', marginTop: '3px' }}>
                Use credentials provided by the Administrator
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div style={{
          background: '#EFF6FF', borderBottom: '1px solid #BFDBFE',
          padding: '10px 28px', display: 'flex', gap: '8px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '14px', marginTop: '1px' }}>ℹ️</span>
          <p style={{ fontSize: '12px', color: '#1D4ED8', margin: 0, lineHeight: 1.5 }}>
            Test accounts are issued by the Admin for evaluation or demo purposes.
            Contact your administrator if you do not have credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Test User ID
            </label>
            <div className="input-group">
              <span className="input-icon">🪪</span>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. TEST-001"
                value={testId}
                onChange={e => setTestId(e.target.value)}
                id="test-login-id"
                autoFocus
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Test Password
            </label>
            <div className="input-group">
              <span className="input-icon">🔑</span>
              <input
                type={showPwd ? 'text' : 'password'}
                className="form-control has-right"
                placeholder="Enter test password"
                value={testPassword}
                onChange={e => setTestPassword(e.target.value)}
                id="test-login-password"
              />
              <span
                className="input-icon-right"
                onClick={() => setShowPwd(!showPwd)}
                style={{ fontSize: '14px', cursor: 'pointer' }}
              >
                {showPwd ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading
                ? '#93C5FD'
                : 'linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
            id="test-login-submit"
          >
            {loading ? (
              <><div className="spinner" /><span>Verifying...</span></>
            ) : (
              <span>Access Scholar Portal →</span>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ─── Main Login Page ───────────────────────────────────────────── */
export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
    setEmail(getEmailForRole(roleId))
    setPassword('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)

    try {
      let response
      try {
        response = await apiFetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password: password.trim(), role: selectedRole.toLowerCase() })
        })
      } catch (networkErr) {
        throw new Error('Cannot connect to server. Please check your internet connection or try again later.')
      }

      let data = {}
      try {
        data = await response.json()
      } catch {
        throw new Error('Server returned an invalid response. The backend may be down or unreachable.')
      }

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials. Check email and password.')
      }

      localStorage.setItem('rms_token', data.token)
      login(data.user)
      toast.success(`Welcome back, ${data.user.name.split(' ').pop()}!`)

      if (selectedRole.toLowerCase() === 'scholar' && !data.user.isProfileCompleted) {
        toast.custom((t) => (
          <div style={{ background: '#3B82F6', color: '#fff', padding: '12px 20px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
            <span style={{ fontSize: '20px' }}>👋</span>
            <div>
              <div style={{ fontWeight: 600 }}>Welcome to RMS!</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Please fill in your details in My Profile first.</div>
            </div>
          </div>
        ), { duration: 5000 });
        navigate('/scholar/profile')
      } else {
        navigate(`/${selectedRole.toLowerCase()}`)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Called when test login succeeds
  const handleTestLoginSuccess = (data) => {
    localStorage.setItem('rms_token', data.token)
    login(data.user)
    toast.success(`Welcome, ${data.user.name.split(' ').pop()}! (Test Account)`)
    setShowTestModal(false)
    // Test accounts always log in as scholar
    if (!data.user.isProfileCompleted) {
      navigate('/scholar/profile')
    } else {
      navigate('/scholar')
    }
  }

  const currentDemo = DEFAULT_CREDENTIALS[selectedRole]

  return (
    <div className="login-page">
      {showTestModal && (
        <TestLoginModal
          onClose={() => setShowTestModal(false)}
          onSuccess={handleTestLoginSuccess}
        />
      )}

      <div className="login-container">
        {/* Left Panel */}
        <div className="login-left">
          <div className="brand-icon">R</div>
          <h1>Research Management System</h1>
          <p>
            A comprehensive digital platform for managing PhD research workflows,
            thesis submissions, viva voce scheduling, and academic progress tracking.
          </p>
          <div className="login-features">
            {[
              { icon: '🎓', text: 'Multi-role access control' },
              { icon: '📄', text: 'Thesis & synopsis management' },
              { icon: '📅', text: 'Viva voce scheduling' },
              { icon: '📊', text: 'Research progress tracking' },
              { icon: '🔔', text: 'Real-time notifications' },
              { icon: '📈', text: 'Audit logs & reports' },
            ].map((f, i) => (
              <div className="login-feature" key={i}>
                <div className="login-feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <h2>Welcome Back 👋</h2>
          <p className="login-desc">Sign in to access your RMS dashboard</p>

          {/* Role Selector */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select your role
            </p>
            <div className="login-role-selector">
              {ROLES.map(role => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-pill${selectedRole === role.id ? ' active' : ''}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>



          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  id="login-email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control has-right"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  id="login-password"
                  autoComplete="current-password"
                />
                <span
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ fontSize: '14px' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <span className="forgot-link" style={{ marginTop: 0, marginBottom: 0 }}>
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          {/* ── Test Login Divider ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            margin: '20px 0 14px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          {/* Test Login Button */}
          <button
            type="button"
            id="test-login-open"
            onClick={() => setShowTestModal(true)}
            style={{
              width: '100%', padding: '11px 16px',
              background: 'linear-gradient(135deg, #0f2540 0%, #1e3a5f 100%)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', transition: 'opacity 0.2s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontSize: '16px' }}>🧪</span>
            Register Scholar Details — Test Login
          </button>

          <p style={{
            textAlign: 'center', fontSize: '11px',
            color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4,
          }}>
            Test credentials are issued by the Administrator only
          </p>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              © 2024 Research Management System · University of Excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
