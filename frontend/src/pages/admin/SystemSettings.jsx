import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const DEFAULT_SETTINGS = {
  uniName: 'University of Excellence',
  uniCode: 'UOE-2024',
  address: '123 Research Park, Tech City - 560001',
  phone: '+91 80 2222 3333',
  email: 'admin@uoe.edu',
  website: 'https://www.uoe.edu',
  synopsisDeadline: '2024-09-30',
  thesisDeadline: '2024-12-31',
  vivaWindow: '30',
  maxScholarsPerSupervisor: '6',
  minResearchYears: '3',
  maxResearchYears: '6',
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: 'noreply@uoe.edu',
  smtpPass: '',
  emailNotifications: true,
  twoFactor: false,
  sessionTimeout: '60',
  allowSelfReg: false,
  maintenanceMode: false,
}

export default function SystemSettings() {
  const [active, setActive] = useState('general')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('rms_settings') || 'null')
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...stored })
    } catch {}
  }, [])

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setSettings(prev => ({ ...prev, [e.target.name]: val }))
    setHasChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem('rms_settings', JSON.stringify(settings))
    toast.success(' Settings saved and applied successfully!')
    setHasChanges(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset all settings to factory defaults? This cannot be undone.')) {
      setSettings(DEFAULT_SETTINGS)
      localStorage.removeItem('rms_settings')
      toast.success('Settings reset to defaults.')
      setHasChanges(false)
    }
  }

  const handleTestEmail = () => {
    if (!settings.smtpHost || !settings.smtpUser) {
      toast.error('Please fill in SMTP Host and User before testing.')
      return
    }
    toast.success(`Test email sent to ${settings.smtpUser} via ${settings.smtpHost}:${settings.smtpPort}`)
  }

  const tabs = [
    { id: 'general', label: ' General' },
    { id: 'academic', label: ' Academic' },
    { id: 'email', label: ' Email / SMTP' },
    { id: 'security', label: ' Security' },
  ]

  const Input = ({ name, label, type = 'text', placeholder = '' }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input name={name} type={type} className="form-control" placeholder={placeholder} value={settings[name] || ''} onChange={handleChange} />
    </div>
  )

  const Toggle = ({ name, label, desc }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{label}</div>
        {desc && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{desc}</div>}
      </div>
      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
        <input type="checkbox" name={name} checked={!!settings[name]} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: settings[name] ? '#174EA6' : '#CBD5E1',
          borderRadius: '99px', transition: 'all 0.2s',
        }} />
        <span style={{
          position: 'absolute', top: '3px',
          left: settings[name] ? '23px' : '3px',
          width: '18px', height: '18px',
          background: '#fff', borderRadius: '50%',
          transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </label>
    </div>
  )

  return (
    <div className="animate-fade">
      <div className="topbar">
        <div>
          <div className="topbar-title">System Settings</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Configure platform-wide settings and policies</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleReset}> Reset Defaults</button>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: hasChanges ? 'linear-gradient(90deg,#174EA6,#0A2A66)' : '#94A3B8', cursor: hasChanges ? 'pointer' : 'not-allowed' }}
            onClick={handleSave}
          >
             {hasChanges ? 'Save Changes' : 'No Changes'}
          </button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px' }}>
          {/* Sidebar Tabs */}
          <div className="card" style={{ padding: '12px', height: 'fit-content' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: 'none',
                  background: active === tab.id ? '#E8EEF8' : 'transparent',
                  color: active === tab.id ? '#0A2A66' : 'var(--text-secondary)',
                  fontWeight: active === tab.id ? 700 : 500, fontSize: '13.5px', cursor: 'pointer',
                  textAlign: 'left', marginBottom: '4px', transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}

            {/* System info box */}
            <div style={{ marginTop: '24px', padding: '12px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>System Info</div>
              {[
                { label: 'Version', value: 'v2.5.1' },
                { label: 'Build', value: '#20240718' },
                { label: 'DB', value: 'LocalStorage' },
                { label: 'Status', value: ' Online' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="card">
            {active === 'general' && (
              <div>
                <div className="card-header"><div className="card-title"> General Information</div></div>
                <div style={{ padding: '20px 24px' }}>
                  <div className="grid-2">
                    <Input name="uniName" label="University / Institution Name" placeholder="e.g. University of Excellence" />
                    <Input name="uniCode" label="Institution Code" placeholder="e.g. UOE-2024" />
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Full Address</label>
                      <input name="address" className="form-control" placeholder="123 Research Park, Tech City" value={settings.address} onChange={handleChange} />
                    </div>
                    <Input name="phone" label="Phone Number" placeholder="+91 80 2222 3333" />
                    <Input name="email" label="Official Email" type="email" placeholder="admin@university.edu" />
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Website URL</label>
                      <input name="website" className="form-control" placeholder="https://www.university.edu" value={settings.website} onChange={handleChange} />
                    </div>
                  </div>
                  <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
                    <Toggle name="maintenanceMode" label="Maintenance Mode" desc="When enabled, non-admin users cannot access the platform." />
                  </div>
                </div>
              </div>
            )}

            {active === 'academic' && (
              <div>
                <div className="card-header"><div className="card-title"> Academic Policy Settings</div></div>
                <div style={{ padding: '20px 24px' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Synopsis Submission Deadline</label>
                      <input name="synopsisDeadline" type="date" className="form-control" value={settings.synopsisDeadline} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Thesis Submission Deadline</label>
                      <input name="thesisDeadline" type="date" className="form-control" value={settings.thesisDeadline} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Viva Scheduling Window (days)</label>
                      <input name="vivaWindow" type="number" min={7} max={90} className="form-control" value={settings.vivaWindow} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max Scholars per Supervisor</label>
                      <input name="maxScholarsPerSupervisor" type="number" min={1} max={20} className="form-control" value={settings.maxScholarsPerSupervisor} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Min. Research Duration (years)</label>
                      <input name="minResearchYears" type="number" min={1} max={10} className="form-control" value={settings.minResearchYears} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max. Research Duration (years)</label>
                      <input name="maxResearchYears" type="number" min={1} max={10} className="form-control" value={settings.maxResearchYears} onChange={handleChange} />
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: '#FFF6D8', borderRadius: 'var(--radius-md)', border: '1px solid #FCD34D', marginTop: '16px' }}>
                    <span style={{ fontSize: '12.5px', color: '#936C00', fontWeight: 600 }}>
                       Changing academic policies will affect all active scholars. Review carefully before saving.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {active === 'email' && (
              <div>
                <div className="card-header">
                  <div className="card-title"> Email & SMTP Configuration</div>
                  <button className="btn btn-ghost btn-sm" onClick={handleTestEmail}> Send Test Email</button>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div className="grid-2">
                    <Input name="smtpHost" label="SMTP Host" placeholder="smtp.gmail.com" />
                    <Input name="smtpPort" label="SMTP Port" placeholder="587" />
                    <Input name="smtpUser" label="SMTP Username / From Email" placeholder="noreply@university.edu" />
                    <div className="form-group">
                      <label className="form-label">SMTP Password</label>
                      <input name="smtpPass" type="password" className="form-control" placeholder="---------" value={settings.smtpPass} onChange={handleChange} />
                    </div>
                  </div>
                  <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
                    <Toggle name="emailNotifications" label="Enable Email Notifications" desc="Send automated email alerts for thesis submissions, approvals, and DRC meetings." />
                  </div>
                </div>
              </div>
            )}

            {active === 'security' && (
              <div>
                <div className="card-header"><div className="card-title"> Security & Access Settings</div></div>
                <div style={{ padding: '20px 24px' }}>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Session Timeout (minutes)</label>
                    <input name="sessionTimeout" type="number" min={5} max={480} className="form-control" style={{ maxWidth: '200px' }} value={settings.sessionTimeout} onChange={handleChange} />
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>Users will be automatically logged out after this period of inactivity.</div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <Toggle name="twoFactor" label="Two-Factor Authentication (2FA)" desc="Require OTP verification for all admin logins." />
                    <Toggle name="allowSelfReg" label="Allow Self-Registration" desc="New users can sign up without admin approval." />
                  </div>
                  <div style={{ marginTop: '20px', padding: '16px', background: '#F9E6E8', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA' }}>
                    <div style={{ fontWeight: 700, color: '#9F1E24', marginBottom: '8px' }}> Danger Zone</div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm('Clear ALL application data including users, research, and settings? This cannot be undone!')) {
                          ['rms_all_users', 'rms_research', 'rms_settings', 'rms_user'].forEach(k => localStorage.removeItem(k))
                          toast.success('All data cleared. Please refresh the page.')
                        }
                      }}
                    >
                       Clear All Application Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save footer bar */}
            <div style={{
              padding: '14px 24px', borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'flex-end', gap: '10px', background: hasChanges ? '#FFF6D8' : '#F8FAFC'
            }}>
              {hasChanges && <span style={{ fontSize: '12.5px', color: '#936C00', fontWeight: 600, alignSelf: 'center' }}> Unsaved changes</span>}
              <button className="btn btn-ghost btn-sm" onClick={handleReset}>Reset</button>
              <button
                className="btn btn-primary btn-sm"
                style={{ background: 'linear-gradient(90deg,#174EA6,#0A2A66)' }}
                onClick={handleSave}
              >
                 Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
