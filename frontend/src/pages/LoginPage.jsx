import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

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
    return match ? match.email : DEFAULT_CREDENTIALS[roleId]?.email
  } catch {
    return DEFAULT_CREDENTIALS[roleId]?.email
  }
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('admin')
  const [email, setEmail] = useState('admin@rms.edu')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
    setEmail(getEmailForRole(roleId) || DEFAULT_CREDENTIALS[roleId]?.email || '')
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole.toLowerCase() })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials. Check email and password.')
      }

      // Store JWT token for API calls
      localStorage.setItem('rms_token', data.token)
      
      // Update Context
      login(data.user)
      toast.success(`Welcome back, ${data.user.name.split(' ').pop()}!`)
      navigate(`/${selectedRole.toLowerCase()}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentDemo = DEFAULT_CREDENTIALS[selectedRole]

  return (
    <div className="login-page">
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

          {/* Demo hint */}
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#166534',
          }}>
            <strong>Demo:</strong> {currentDemo.email} / <strong>{currentDemo.password}</strong>
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

          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              © 2024 Research Management System · University of Excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
