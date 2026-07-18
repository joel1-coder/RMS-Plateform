# RMS Platform - AI Memory File

## Project Overview
**Name:** Research Management System (RMS)  
**Scholar Theme:** Dark slate sidebar (linear-gradient #0F172A→#1E293B) with green accent (#10B981)

**Stack:** React + Vite (Frontend) | Node.js + Express (Backend)  
**Database:** MongoDB  
**Auth:** JWT-based role authentication  

## Roles
1. Admin
2. Supervisor
3. Scholar (PhD Student)
4. HOD (Head of Department)
5. DRC (Doctoral Research Committee)
6. Librarian (inferred)

---

## Role: Admin

### Page: Login
- **Components:** Logo/Brand, Email Input, Password Input, Login Button, Forgot Password Link
- **Layout:** Centered card on gradient/split background
- **Actions:** POST /api/auth/login → JWT token → redirect by role
- **Role Access:** Admin

### Page: Dashboard (RMS Dashboard)
- **Components:** Sidebar Nav, Stats Cards (Scholars, Supervisors, Departments, etc.), Recent Activity Table, Charts
- **Layout:** Sidebar left + Main content area
- **Actions:** GET /api/admin/dashboard
- **Role Access:** Admin

### Page: Audit Log
- **Components:** Sidebar, Table (user, action, timestamp, IP), Filters (date, role, action), Pagination
- **Layout:** Sidebar + Main table view
- **Actions:** GET /api/admin/audit-logs
- **Role Access:** Admin

### Page: System Settings
- **Components:** Sidebar, Settings Form (university name, SMTP, logo upload, deadlines)
- **Layout:** Sidebar + Form panel
- **Actions:** GET/PUT /api/admin/settings
- **Role Access:** Admin

### Page: Notifications
- **Components:** Sidebar, Notification list (read/unread), Mark all read button
- **Layout:** Sidebar + notification feed
- **Actions:** GET /api/admin/notifications
- **Role Access:** Admin

### Page: Reports
- **Components:** Sidebar, Report type selector, Date range picker, Export (PDF/Excel), Chart/Table
- **Layout:** Sidebar + report area
- **Actions:** GET /api/admin/reports
- **Role Access:** Admin

### Page: Viva Voce Management
- **Components:** Sidebar, Table (scholars, date, panel, status), Schedule button, Edit/Delete actions
- **Layout:** Sidebar + data table
- **Actions:** GET/POST /api/admin/viva
- **Role Access:** Admin

### Page: Thesis Management
- **Components:** Sidebar, Table (scholar, title, submission date, status), Review/Approve actions
- **Layout:** Sidebar + data table
- **Actions:** GET/PUT /api/admin/thesis
- **Role Access:** Admin

### Page: Synopsis Management
- **Components:** Sidebar, Table (scholar, synopsis title, date, status), Approve/Reject actions
- **Layout:** Sidebar + data table
- **Actions:** GET/PUT /api/admin/synopsis
- **Role Access:** Admin

### Page: Research Management
- **Components:** Sidebar, Table (scholar, research topic, supervisor, status), Filters
- **Layout:** Sidebar + data table
- **Actions:** GET /api/admin/research
- **Role Access:** Admin

### Page: DRC Management
- **Components:** Sidebar, Table (committee members, department, role), Add/Edit/Remove actions
- **Layout:** Sidebar + data table
- **Actions:** GET/POST/PUT/DELETE /api/admin/drc
- **Role Access:** Admin

### Page: User Management
- **Components:** Sidebar, Table (users, role, department, status), Add User Modal, Edit/Deactivate actions
- **Layout:** Sidebar + data table
- **Actions:** GET/POST/PUT/DELETE /api/admin/users
- **Role Access:** Admin

---

---

## Role: Scholar

### Page: Dashboard
- **Components:** Hero progress card (68%), stat cards, area chart, milestone timeline, deadline tracker, recent activity feed
- **Layout:** Sidebar + full-width page with dark gradient hero card
- **Actions:** GET /api/scholar/dashboard
- **Role Access:** Scholar

### Page: Profile
- **Components:** Avatar card, quick-info panel, supervisor card, personal/academic/password form sections, edit mode toggle
- **Layout:** 300px profile sidebar + main form area (2 columns)
- **Actions:** GET/PUT /api/scholar/profile
- **Role Access:** Scholar

### Page: My Research
- **Components:** Research topic banner, tab switcher (Overview/Updates/Publications/Keywords), phase progress bars, timeline updates, publications table, keyword tags
- **Layout:** Full-width with tab content
- **Actions:** GET/POST /api/scholar/research
- **Role Access:** Scholar

### Page: Synopsis
- **Components:** Approval status banner (green), 5-step progress timeline, synopsis details panel, submission history with versions
- **Layout:** Banner + 2-column grid
- **Actions:** GET/POST /api/scholar/synopsis
- **Role Access:** Scholar

### Page: Thesis
- **Components:** Stat cards, overall progress bar, chapter table (6 chapters), upload modal, final submission CTA
- **Layout:** Full-width with chapter table
- **Actions:** GET/POST /api/scholar/thesis
- **Role Access:** Scholar

### Page: Documents
- **Components:** Drag-and-drop upload zone, category filter pills, document table with preview/download/delete
- **Layout:** Drop zone + filter bar + table
- **Actions:** GET/POST/DELETE /api/scholar/documents
- **Role Access:** Scholar

### Page: Viva Voce
- **Components:** Indigo gradient banner with countdown (117 days), panel member list (Chairman/Examiners/Supervisor), exam details, guidelines grid
- **Layout:** Banner + 2-column grid + guidelines
- **Actions:** GET /api/scholar/viva
- **Role Access:** Scholar

### Page: Progress Report
- **Components:** Stat cards, upcoming deadline alert (amber), submit modal, history table, evaluation criteria with progress bars
- **Layout:** Alert banner + table + criteria grid
- **Actions:** GET/POST /api/scholar/progress
- **Role Access:** Scholar

### Page: Publications
- **Components:** Stat cards (citations, SCI count), type filter tabs, publication cards with IF/indexing/DOI, add modal
- **Layout:** Filter bar + card list
- **Actions:** GET/POST/DELETE /api/scholar/publications
- **Role Access:** Scholar

### Page: My Schedule
- **Components:** Week view calendar grid (7 days × 8 time slots), color-coded events, upcoming events sidebar, legend
- **Layout:** Calendar + sidebar
- **Actions:** GET /api/scholar/schedule
- **Role Access:** Scholar

### Page: Notifications
- **Components:** Stat cards, filter tabs (All/Unread/Read), notification items with colored left border, read/delete actions
- **Layout:** Filter bar + notification list
- **Actions:** GET/PUT /api/scholar/notifications
- **Role Access:** Scholar

---

## Role: Supervisor

### Page: Dashboard
- **Components:** KPI cards (Active, Pending, Upcoming), Scholar progress chart (Bar layout), Upcoming Milestones list, Recent Publications table, Quick Action buttons.
- **Layout:** Header + KPI Grid + 2-Column charts/lists + Table list.
- **Actions:** GET /api/supervisor/dashboard
- **Role Access:** Supervisor

### Page: My Scholars
- **Components:** Total supervised card, On Track card, Needs Attention card, Filter/Search Bar, Scholars table with name, dept, topic, progress, status, and Action buttons.
- **Layout:** Header + KPI Mini Grid + Filter Bar + Table Grid.
- **Actions:** GET /api/supervisor/scholars
- **Role Access:** Supervisor

### Page: Synopsis Review
- **Components:** Review Synopsis modal, KPI cards (Pending, Approved, Review Time), Submissions table queue, Guidelines panel, Upcoming meetings panel.
- **Layout:** Header + KPI Grid + 2-Column queue/guidelines.
- **Actions:** GET/POST /api/supervisor/synopsis
- **Role Access:** Supervisor

### Page: Thesis Review
- **Components:** Review Thesis modal with remarks, KPI cards, Submissions queue table, Tip panel, Defense committee widget.
- **Layout:** Header + KPI Grid + 2-Column list.
- **Actions:** GET/POST /api/supervisor/thesis
- **Role Access:** Supervisor

### Page: Publications Review
- **Components:** KPI cards, Filter tabs (SCI, Scopus, Other), Submissions table list with verification/approval action buttons.
- **Layout:** Header + KPI Grid + Filter Bar + Table.
- **Actions:** GET/POST /api/supervisor/publications
- **Role Access:** Supervisor

### Page: Meetings Management
- **Components:** Schedule Meeting modal, KPI cards, Month calendar view, Upcoming meetings queue with Join/Edit buttons, Resources panel.
- **Layout:** Header + KPI Grid + 2-Column calendar/list.
- **Actions:** GET/POST /api/supervisor/meetings
- **Role Access:** Supervisor

### Page: Progress Reports
- **Components:** KPI cards, Filter controls (Status, Date Range), Submissions table with progress bar indicator and action buttons.
- **Layout:** Header + Filters + Submissions Table.
- **Actions:** GET/POST /api/supervisor/progress
- **Role Access:** Supervisor

### Page: Reports & Analytics
- **Components:** Progress distribution donut pie chart, Completion rate horizontal bar chart, Scholar status overview table.
- **Layout:** Header + 2-Column charts + Table overview.
- **Actions:** GET /api/supervisor/reports
- **Role Access:** Supervisor

### Page: Notifications
- **Components:** Read/unread filtering tabs, Notification list with category icons and action buttons.
- **Layout:** Header + Filter Bar + List.
- **Actions:** GET/PUT /api/supervisor/notifications
- **Role Access:** Supervisor

### Page: Profile
- **Components:** Faculty profile avatar card, Specializations tags, Personal information fields, Departmental details.
- **Layout:** 2-Column profile sidebar + Form area.
- **Actions:** GET/PUT /api/supervisor/profile
- **Role Access:** Supervisor

---

## Role: HOD

### Page: Dashboard
- **Components:** Search box, KPI cards, Welcome banner with QoQ metrics, Department Summary bar chart, Recent Activity log, Next Milestone highlight, 3-column Upcoming Milestones cards.
- **Layout:** Header + Welcome Banner + KPI Grid + 2-Column layout (chart/activity) + Milestone cards.
- **Actions:** GET /api/hod/dashboard
- **Role Access:** HOD

### Page: Department Scholars
- **Components:** Status filter tabs (All/Active/Completed/On Hold), Area filter, Search input, Scholars table list with Register Number, Area tags, Supervisor name, and action items, Summary row with unassigned alerts.
- **Layout:** Header + Filter Row + Table + Summary Grid.
- **Actions:** GET/PUT /api/hod/scholars
- **Role Access:** HOD

### Page: Supervisors Management
- **Components:** Total/Available/At Capacity KPIs, Search bar, Availability filter tabs, Supervisors table with registration loads, capacity percentages, load progress bars.
- **Layout:** Header + KPI Grid + Filter Row + Table.
- **Actions:** GET/POST /api/hod/supervisors
- **Role Access:** HOD

### Page: Allocations
- **Components:** Unassigned Scholars queue list with specialty tags and topics, Faculty Pool list showing availability badges, workload progress bars, Confirm Allocation modal.
- **Layout:** Header + 2-Column Allocations grid (Scholars vs Faculty).
- **Actions:** GET/POST /api/hod/allocations
- **Role Access:** HOD

### Page: Reports
- **Components:** Scholars by Research Area pie donut chart, Completion Rate Trends annual/quarterly line chart, Scholar Performance Summary table, Bottom KPI strip.
- **Layout:** Header + 2-Column charts layout + Table list + Summary strip.
- **Actions:** GET /api/hod/reports
- **Role Access:** HOD

### Page: Notifications
- **Components:** Notification lists with icons, date/time, and mark as read options.
- **Layout:** Header + Notifications list.
- **Actions:** GET/PUT /api/hod/notifications
- **Role Access:** HOD

---

## Role: DRC

### Page: Dashboard
- **Components:** KPI cards (Pending synopses, Active committees, Scheduled meetings, Approved YTD), approvals vs. rejections bar chart, quick task listing, pending synopses overview table, upcoming DRC meetings list.
- **Layout:** Header + KPI Grid + 2-Column charts layout + 2-Column lists layout.
- **Actions:** GET /api/drc/dashboard
- **Role Access:** DRC

### Page: Synopsis Approval
- **Components:** Review/digital signature modal with remarks textarea and approval/revision actions, KPI cards (Pending review, Approved, Revisions requested), synopses table.
- **Layout:** Header + KPI Grid + Table Queue.
- **Actions:** GET/POST /api/drc/synopsis
- **Role Access:** DRC

### Page: Committee Management
- **Components:** Establish committee modal with members selection checklist, DRC committees status table (Active/Inactive), toggle buttons.
- **Layout:** Header + Table.
- **Actions:** GET/POST /api/drc/committees
- **Role Access:** DRC

### Page: Meeting Management
- **Components:** Schedule DRC review session modal with committee, candidate, date/time, room/link inputs, evaluation sessions list table.
- **Layout:** Header + Table.
- **Actions:** GET/POST /api/drc/meetings
- **Role Access:** DRC

### Page: Meeting Minutes (MoM)
- **Components:** Record MoM modal with decisions and resolutions textarea inputs, Minutes archive table list with finalize/Chairman digital sign action trigger buttons.
- **Layout:** Header + Table.
- **Actions:** GET/POST /api/drc/minutes
- **Role Access:** DRC

### Page: Reports & Analytics
- **Components:** Pie chart for evaluation status ratios, Bar chart for departmental scholar count, Recent approved synopses overview list.
- **Layout:** Header + 2-Column charts + Table.
- **Actions:** GET /api/drc/reports
- **Role Access:** DRC

### Page: Notifications
- **Components:** All/Read/Unread system alerts feed filtered by category, read and clear actions.
- **Layout:** Header + Notifications list.
- **Actions:** GET/PUT /api/drc/notifications
- **Role Access:** DRC

---

## Color Palette
- Primary: #6C63FF (Purple)
- Secondary: #4F46E5 (Deep Indigo)
- Accent: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Danger: #EF4444 (Red)
- Background: #F8FAFC (Light Gray)
- Sidebar BG: #1E1B4B (Dark Indigo)
- Card BG: #FFFFFF
- Text Primary: #1E293B
- Text Secondary: #64748B

## Typography
- Font: Inter (Google Fonts)
- Heading: 700 weight
- Body: 400 weight
- Label: 500 weight
