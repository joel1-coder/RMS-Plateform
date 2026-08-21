# Check AI.md — RMS Platform Progress Log

---

## [2026-07-17 23:45 IST] — Initial Setup

### Created:
- Project scaffold: `frontend/` via Vite + React
- `AI.md` — Role/page memory file initialized
- `Check AI.md` — Progress log initialized

### In Progress:
- Admin Login Screen
- Admin Dashboard
- All 12 Admin Pages

### Features Planned:
- Role-based routing
- JWT authentication
- Admin sidebar with navigation
- Responsive layouts
- Pixel-perfect UI matching Figma

---

## [2026-08-19 19:00 IST] — Backend Integration Phase (Admin Panel)

### Completed:
- **MongoDB Atlas Connectivity**: Configured and successfully connected backend to the remote Atlas database. Implemented Google public DNS override (`8.8.8.8`) in Mongoose `connectDB` config to resolve SRV resolution failures in restrictive network environments.
- **Vite Reverse Proxy**: Set up `/api` reverse proxy in `vite.config.js` to automatically route API calls to the local Node.js server on port 5000, eliminating CORS issues.
- **Admin Dashboard Integration**:
  - Removed the profile icon and `+ Add User` button from the top right topbar header per user requests.
  - Created a unified `GET /api/reports/admin-dashboard` stats endpoint in the Express app.
  - Hooked the React `AdminDashboard.jsx` to fetch live counts (scholars, supervisors, active research, pending thesis, viva scheduled, departments) and month-by-month research trend charts directly from the database.
- **User Management CRUD Integration**:
  - Connected `UserManagement.jsx` to backend endpoints for user lookup, creation, status-toggling, and deletion.
  - Added `plainPassword` tracking to the backend schema and endpoint responses (under admin-specific JWT checks) to preserve the admin's visibility of login passwords in the table.

---

## [2026-08-19 19:25 IST] — Backend Integration Phase (Research, Viva, Thesis, Publications)

### Completed:
- **Research Module Connectivity**: Connected `ResearchManagement.jsx` to live `/api/research` backend endpoints (full CRUD operations integrated with MongoDB Atlas).
- **Dedicated Viva Voce Collection & API**:
  - Created `viva_voces` MongoDB collection/model (`VivaVoce.model.js`).
  - Created Express routes & controller under `/api/viva-voce`.
  - Hooked up `VivaVoce.jsx` to load vivas, select scholars from registered users, auto-fill supervisor, and schedule/edit/delete/complete.
- **Dedicated Thesis Collection & API**:
  - Created `theses` MongoDB collection/model (`Thesis.model.js`).
  - Hooked up `ScholarThesis.jsx` to list submissions, upload new drafts via multipart FormData, and display feedback remarks.
- **Dedicated Publications Collection & API**:
  - Created `publications` MongoDB collection/model (`Publication.model.js`).
  - Hooked up `ScholarPublications.jsx` to list, save, edit, and delete publications of all types (Patents, Journals, Chapters, etc.) mapping `pubType` and `journal` fields.

---

## [2026-08-19 19:28 IST] — Backend Integration Phase (Supervisor Thesis & Publications Review)

### Completed:
- **Supervisor Thesis Review Connection**:
  - Wired `ThesisReview.jsx` to fetch pending thesis submissions directly from the `theses` collection.
  - Allowed supervisors to upload thesis drafts for a specific scholar dynamically.
  - Hooked up the review actions (Approve, Reject, Request Revisions) to the backend API `PUT /api/thesis/:id`.
- **Supervisor Publications Review Connection**:
  - Connected `PublicationsReview.jsx` to load all publication submissions.
  - Integrated status verification (Verify, Approve) and detailed view modals with live MongoDB operations.

---

## [2026-08-19 19:40 IST] — Backend Integration Phase (Assign Scholar, Audit Log, & Reports)

### Completed:
- **Scholar-Supervisor Allocation**:
  - Implemented dynamic filtering on the Admin's "Select Scholar" dropdown to display only unassigned scholars.
  - Designed an HTML5 datalist searchable input overlay for the supervisor selection dropdown to allow searching among hundreds of staff items.
  - Added double notification trigger triggers to `Notification` collection to notify both scholar and supervisor upon allocation.
- **System Audit Log**:
  - Created `AuditLog` model (`AuditLog.model.js`) and logging utility helper (`auditLogger.js`).
  - Added audit logger hooks on User CRUD (Create, Update, Delete) and Scholar Assignment.
  - Connected `AuditLog.jsx` page to dynamic `/api/audit` API endpoint.
- **Reports & Analytics**:
  - Connected `Reports.jsx` to live `/api/research` backend API.
  - Enabled dynamic Scholar Lookup matching in MongoDB database.
- **Notifications Display**:
  - Wired `Notifications.jsx` to fetch personal notifications from `/api/notifications`.

---

## [2026-08-19 20:38 IST] — Backend Integration Phase (Meetings & Scholar Notifications)

### Completed:
- **Meetings Schedule Database Wireup**:
  - Connected `DRCManagement.jsx` page (Meetings menu) to live `/api/meetings` Express API CRUD routes.
- **Dynamic Scholar Alerts**:
  - Configured `meetings.controller.js` on creation/modification of slots to locate the scholar user in the database case-insensitively.
  - Automatically dispatches real-time allocation notification alerts to the Scholar (and their assigned Supervisor).
- **Meetings Audit Records**:
  - Enabled audit trails to log scheduled slots and cancellations to the DB logs automatically.

---

## Status Tracker

| Role | Page | Status |
|------|------|--------|
| Admin | Login | ✅ Complete |
| Admin | Dashboard | ✅ Complete |
| Admin | Audit Log | ✅ Complete |
| Admin | System Settings | ✅ Complete |
| Admin | Notifications | ✅ Complete |
| Admin | Reports | ✅ Complete |
| Admin | Viva Voce | ✅ Complete |
| Admin | Thesis Management | ✅ Complete |
| Admin | Synopsis Management | ✅ Complete |
| Admin | Research Management | ✅ Complete |
| Admin | Meetings | ✅ Complete |
| Admin | Assign Scholar | ✅ Complete |
| Admin | User Management | ✅ Complete |
| Scholar | Dashboard | ✅ Complete |
| Scholar | Profile | ✅ Complete |
| Scholar | My Research | ✅ Complete |
| Scholar | Synopsis | ✅ Complete |
| Scholar | Thesis | ✅ Complete |
| Scholar | Documents | ✅ Complete |
| Scholar | Viva Voce | ✅ Complete |
| Scholar | Progress Report | ✅ Complete |
| Scholar | Publications | ✅ Complete |
| Scholar | My Schedule | ✅ Complete |
| Scholar | Notifications | ✅ Complete |
| Supervisor | Login / Role Sel | ✅ Complete |
| Supervisor | Dashboard | ✅ Complete |
| Supervisor | My Scholars | ✅ Complete (Dynamic) |
| Supervisor | Synopsis Review | ✅ Complete |
| Supervisor | Thesis Review | ✅ Complete |
| Supervisor | Publications Review | ✅ Complete |
| Supervisor | Meetings Management | ✅ Complete |
| Supervisor | Progress Reports | ✅ Complete |
| Supervisor | Notifications | ✅ Complete |
| Supervisor | Profile | ✅ Complete |
| HOD | Login / Role Sel | ✅ Complete |
| HOD | Dashboard | ✅ Complete |
| HOD | Department Scholars | ✅ Complete |
| HOD | Supervisors | ✅ Complete |
| HOD | Allocations | ✅ Complete |
| HOD | Reports & Analytics | ✅ Complete |
| HOD | Notifications | ✅ Complete |
| DRC | Login / Role Sel | ✅ Complete |
| DRC | Dashboard | ✅ Complete |
| DRC | Synopsis Approval | ✅ Complete |
| DRC | Meeting Management | ✅ Complete |
| DRC | Meeting Minutes | ✅ Complete |
| DRC | Reports & Analytics | ✅ Complete |
| DRC | Notifications | ✅ Complete |

## [2026-08-21 22:45 IST] — Admin Reports & Analytics Connection

### Implemented:
- Enhanced `reports.controller.js` `getAdminDashboardStats` to return detailed counts for thesis statuses (submitted, approved, rejected) and scholar statuses (active, completed, discontinued).
- Connected `frontend/src/pages/admin/Reports.jsx` to fetch `/api/reports/admin-dashboard` and calculate 4 dynamic top stats (Total Projects, Completion Rate, Avg PhD Duration, Success Rate) from live `research` data.
- Bound live data to Recharts `BarChart` and `AreaChart` in Reports UI.

## [2026-08-21 23:20 IST] — Scholar Portal Backend Connection & Live Workflow Tracking

### Implemented:
- **Backend Models & Controllers**:
  - Expanded `Submission.model.js` with `version`, `period`, `category`, `workDone`, `planNext`, `drcMeetingDate`, and `approvalDate`.
  - Added `coSupervisor`, `domain`, and `objectives` to `ResearchProject.model.js`.
  - Created `GET /api/submissions`, `POST /api/submissions/progress`, `POST /api/submissions/document`, and `DELETE /api/submissions/:id`.
  - Updated `publication.routes.js` and `publication.controller.js` to allow scholars to view, add, edit, and delete their own publications.
- **Scholar Synopsis (`ScholarSynopsis.jsx`)**:
  - Added first-time submission guidance when no submission exists in the database.
  - Implemented dynamic Synopsis Details with scholar name, registration number, supervisor, co-supervisor (`-` if none), DRC dates, and version.
  - Built real-time 5-stage approval timeline (`Draft Prepared` → `Supervisor Review` → `Submitted` → `DRC Review` → `Approved`).
  - Added dynamic submission history list with document download links.
- **My Research (`ScholarResearch.jsx`)**:
  - Connected to `/api/research` for current scholar project.
  - Dynamically renders research topic, supervisor, co-supervisor (`-`), domain, and stage-calculated phases.
- **Scholar Documents (`ScholarDocuments.jsx`)**:
  - Dynamically aggregates submissions, publications, and thesis files.
  - Supports drag & drop and manual document uploads.
- **Scholar Progress Report (`ScholarProgress.jsx`)**:
  - Connected to backend `/api/submissions?type=progress_report` for bi-annual report tracking.
- **Scholar Publications (`ScholarPublications.jsx`)**:
  - Removed mock fallback data to display live database records with full CRUD support.

## [2026-08-22 00:15 IST] — Supervisor Portal Backend Connection & Live Workflow Tracking

### Implemented:
- **Backend Permissions & Scoping**:
  - Updated `users.routes.js` and `validators.js` to authorize `supervisor` and `drc` roles on `GET /api/users`.
  - Scoped `listUsers` and `listSubmissions` so supervisors automatically retrieve only scholars assigned to them.
  - Allowed supervisors on `POST /api/thesis` to upload drafts on behalf of scholars and review submissions.
- **Supervisor Dashboard (`SupervisorDashboard.jsx`)**:
  - Displays dynamic supervisor name (`user.name`), live KPI counts (Active Scholars, Pending Synopsis, Pending Thesis, Publications), and dynamic `Scholar Progress Overview` bar chart.
  - Displays live pending action items with direct navigation links.
- **My Scholars (`MyScholars.jsx`)**:
  - Connected to `/api/users?role=scholar` and `/api/research`.
  - Automatically lists scholars assigned to this supervisor with research topic, progress percentage, admission year, and status.
- **Synopsis Review (`SynopsisReview.jsx`)**:
  - Connected to live `/api/submissions?type=synopsis`.
  - Implemented supervisor approval workflow: Approving advances status to `'Pending DRC Review'` for DRC review queue; requesting changes sets `'Changes Requested'`.
  - Added direct synopsis PDF download links.
- **Thesis Review (`ThesisReview.jsx`)**:
  - Connected to `/api/thesis` with live status updates (`Approved`, `Changes Requested`, `Rejected`).
  - Upload modal populates with supervisor's assigned scholars from backend.
- **DC Members Management (`DCMembersManagement.jsx`) & Schedule Meeting (`ScheduleDCMeeting.jsx`)**:
  - Replaced hardcoded lists with dynamic scholars assigned to the logged-in supervisor.
