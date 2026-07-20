import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages - Auth
import LoginPage from './pages/LoginPage'

// Pages - Admin
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import AuditLog from './pages/admin/AuditLog'
import SystemSettings from './pages/admin/SystemSettings'
import Notifications from './pages/admin/Notifications'
import Reports from './pages/admin/Reports'
import VivaVoce from './pages/admin/VivaVoce'
import ResearchManagement from './pages/admin/ResearchManagement'
import DRCManagement from './pages/admin/DRCManagement'
import AssignScholar from './pages/admin/AssignScholar'

// Pages - Scholar
import ScholarLayout from './layouts/ScholarLayout'
import ScholarDashboard from './pages/scholar/ScholarDashboard'
import ScholarProfile from './pages/scholar/ScholarProfile'
import ScholarResearch from './pages/scholar/ScholarResearch'
import ScholarSynopsis from './pages/scholar/ScholarSynopsis'
import ScholarThesis from './pages/scholar/ScholarThesis'
import ScholarDocuments from './pages/scholar/ScholarDocuments'
import ScholarViva from './pages/scholar/ScholarViva'
import ScholarProgress from './pages/scholar/ScholarProgress'
import ScholarPublications from './pages/scholar/ScholarPublications'
import ScholarSchedule from './pages/scholar/ScholarSchedule'
import ScholarNotifications from './pages/scholar/ScholarNotifications'

// Pages - Supervisor
import SupervisorLayout from './layouts/SupervisorLayout'
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard'
import MyScholars from './pages/supervisor/MyScholars'
import SynopsisReview from './pages/supervisor/SynopsisReview'
import ThesisReview from './pages/supervisor/ThesisReview'
import PublicationsReview from './pages/supervisor/PublicationsReview'
import MeetingsManagement from './pages/supervisor/MeetingsManagement'
import ProgressReports from './pages/supervisor/ProgressReports'
import ReportsAnalytics from './pages/supervisor/ReportsAnalytics'
import SupervisorNotifications from './pages/supervisor/Notifications'
import SupervisorProfile from './pages/supervisor/Profile'

// Pages - HOD
import HODLayout from './layouts/HODLayout'
import HODDashboard from './pages/hod/HODDashboard'
import DepartmentScholars from './pages/hod/DepartmentScholars'
import SupervisorsManagement from './pages/hod/SupervisorsManagement'
import HODAllocations from './pages/hod/HODAllocations'
import HODReports from './pages/hod/HODReports'
import HODNotifications from './pages/hod/HODNotifications'

// Pages - DRC
import DRCLayout from './layouts/DRCLayout'
import DRCDashboard from './pages/drc/DRCDashboard'
import DRCSynopsisApproval from './pages/drc/DRCSynopsisApproval'
import CommitteeManagement from './pages/drc/CommitteeManagement'
import DRCMeetingManagement from './pages/drc/DRCMeetingManagement'
import MeetingMinutes from './pages/drc/MeetingMinutes'
import DRCReports from './pages/drc/DRCReports'
import DRCNotifications from './pages/drc/DRCNotifications'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user, isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="viva" element={<VivaVoce />} />
        <Route path="research" element={<ResearchManagement />} />
        <Route path="drc" element={<DRCManagement />} />
        <Route path="assign" element={<AssignScholar />} />
      </Route>

      {/* Scholar Routes */}
      <Route path="/scholar" element={
        <ProtectedRoute allowedRoles={['scholar']}>
          <ScholarLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ScholarDashboard />} />
        <Route path="profile" element={<ScholarProfile />} />
        <Route path="research" element={<ScholarResearch />} />
        <Route path="synopsis" element={<ScholarSynopsis />} />
        <Route path="thesis" element={<ScholarThesis />} />
        <Route path="documents" element={<ScholarDocuments />} />
        <Route path="viva" element={<ScholarViva />} />
        <Route path="progress" element={<ScholarProgress />} />
        <Route path="publications" element={<ScholarPublications />} />
        <Route path="schedule" element={<ScholarSchedule />} />
        <Route path="notifications" element={<ScholarNotifications />} />
      </Route>

      {/* Supervisor Routes */}
      <Route path="/supervisor" element={
        <ProtectedRoute allowedRoles={['supervisor']}>
          <SupervisorLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SupervisorDashboard />} />
        <Route path="scholars" element={<MyScholars />} />
        <Route path="synopsis" element={<SynopsisReview />} />
        <Route path="thesis" element={<ThesisReview />} />
        <Route path="publications" element={<PublicationsReview />} />
        <Route path="meetings" element={<MeetingsManagement />} />
        <Route path="progress" element={<ProgressReports />} />
        <Route path="notifications" element={<SupervisorNotifications />} />
        <Route path="profile" element={<SupervisorProfile />} />
      </Route>

      {/* HOD Routes */}
      <Route path="/hod" element={
        <ProtectedRoute allowedRoles={['hod']}>
          <HODLayout />
        </ProtectedRoute>
      }>
        <Route index element={<HODDashboard />} />
        <Route path="scholars" element={<DepartmentScholars />} />
        <Route path="supervisors" element={<SupervisorsManagement />} />
        <Route path="allocations" element={<HODAllocations />} />
        <Route path="reports" element={<HODReports />} />
        <Route path="notifications" element={<HODNotifications />} />
      </Route>

      {/* DRC Routes */}
      <Route path="/drc" element={
        <ProtectedRoute allowedRoles={['drc']}>
          <DRCLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DRCDashboard />} />
        <Route path="synopsis" element={<DRCSynopsisApproval />} />
        <Route path="meetings" element={<DRCMeetingManagement />} />
        <Route path="minutes" element={<MeetingMinutes />} />
        <Route path="reports" element={<DRCReports />} />
        <Route path="notifications" element={<DRCNotifications />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13.5px',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
