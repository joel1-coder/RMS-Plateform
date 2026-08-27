import { Link, Navigate } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import { InstitutionBrand, InstitutionLogo } from '../components/InstitutionBrand'
import { useAuth } from '../context/AuthContext'

const platformModules = [
  { title: 'Student Dashboard', text: 'Attendance, assignments, timetable, examinations, resources, and profile records.' },
  { title: 'Faculty Dashboard', text: 'Class oversight, scholar review queues, assignment evaluation, and academic reporting.' },
  { title: 'Administration', text: 'Student, faculty, course, department, announcement, and academic record management.' },
  { title: 'Academic Analytics', text: 'Attendance trends, research progress, performance summaries, and department-level reports.' },
]

const announcements = [
  { type: 'Examination Notice', title: 'Internal assessment timetable published', date: '27 Aug 2026' },
  { type: 'Academic Notice', title: 'Coursework mark entry window is open for supervisors', date: '26 Aug 2026' },
  { type: 'Department Notice', title: 'Doctoral Committee meetings scheduled for September review cycle', date: '25 Aug 2026' },
]

const highlights = [
  { label: 'Active Scholars', value: '420' },
  { label: 'Supervisors', value: '35' },
  { label: 'Departments', value: '12' },
  { label: 'Pending Reviews', value: '18' },
]

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth()

  if (isAuthenticated && user?.role) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />
  }

  return (
    <main className="institution-home">
      <header className="home-header">
        <InstitutionBrand title="Research Management System" subtitle="Official Academic Platform" />
        <nav className="home-nav" aria-label="Public navigation">
          <a href="#modules">Modules</a>
          <a href="#announcements">Announcements</a>
          <a href="#support">Support</a>
          <Link className="btn btn-primary btn-sm" to="/login">Portal Login</Link>
        </nav>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-kicker">Institutional Academic Management</div>
          <h1>Research Management System</h1>
          <p>
            A structured platform for students, faculty, HOD offices, DRC committees,
            and administrators to manage academic progress with institutional discipline.
          </p>
          <div className="home-actions">
            <Link className="btn btn-primary btn-lg" to="/login">Access Secure Portal</Link>
            <a className="btn btn-outline btn-lg" href="#announcements">View Notices</a>
          </div>
        </div>
        <div className="home-identity-panel" aria-label="Institution platform summary">
          <InstitutionLogo size="lg" />
          <div>
            <div className="home-panel-title">Official Education Platform</div>
            <p>Academic workflows, records, submissions, and reviews under one governed institutional system.</p>
          </div>
          <div className="home-stat-grid">
            {highlights.map(item => (
              <div key={item.label} className="home-stat">
                <span>{item.value}</span>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-band" id="modules">
        <div className="section-heading">
          <span>Platform Modules</span>
          <h2>Built for academic administration and daily student productivity</h2>
        </div>
        <div className="module-grid">
          {platformModules.map((module, index) => (
            <article className="module-card" key={module.title}>
              <div className="module-index">{String(index + 1).padStart(2, '0')}</div>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-band home-split" id="announcements">
        <div>
          <div className="section-heading">
            <span>Institution Notices</span>
            <h2>Latest academic communications</h2>
          </div>
          <div className="announcement-list">
            {announcements.map(item => (
              <article className="announcement-row" key={item.title}>
                <AppIcon name="bell" size={18} />
                <div>
                  <strong>{item.type}</strong>
                  <p>{item.title}</p>
                </div>
                <time>{item.date}</time>
              </article>
            ))}
          </div>
        </div>
        <aside className="quick-access">
          <h3>Quick Access</h3>
          <Link to="/login">Student Login</Link>
          <Link to="/login">Faculty Login</Link>
          <Link to="/login">Administration Login</Link>
          <Link to="/register">Scholar Registration</Link>
        </aside>
      </section>

      <footer className="home-footer" id="support">
        <InstitutionBrand title="Institution RMS" subtitle="Academic Support Desk" size="sm" />
        <p>For academic or technical assistance, contact the Research Section office during institutional working hours.</p>
      </footer>
    </main>
  )
}
