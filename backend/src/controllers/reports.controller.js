const ResearchProject = require('../models/ResearchProject.model');
const Submission = require('../models/Submission.model');
const Meeting = require('../models/Meeting.model');
const User = require('../models/User.model');
const { asyncHandler } = require('../middlewares/errorHandler');

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalScholars,
    supervisors,
    activeResearch,
    pendingThesis,
    vivaScheduled,
    allDepts,
    users,
    projects,
    submissions,
    meetings
  ] = await Promise.all([
    User.countDocuments({ role: 'scholar' }),
    User.countDocuments({ role: 'supervisor' }),
    ResearchProject.countDocuments({ status: 'Active' }),
    Submission.countDocuments({ type: 'thesis', status: { $ne: 'Approved by DRC' } }),
    Meeting.countDocuments({ type: 'Viva Voce', status: 'Scheduled' }),
    User.distinct('dept'),
    User.find({ role: 'scholar' }, 'dept'),
    ResearchProject.find({}, 'startDate status'),
    Submission.find({ type: 'thesis' }, 'submittedAt status'),
    Meeting.find({ type: 'Viva Voce' }, 'date')
  ]);

  // Compute By Department Pie Chart data
  const deptCounts = {};
  users.forEach(u => {
    if (u.dept) {
      deptCounts[u.dept] = (deptCounts[u.dept] || 0) + 1;
    }
  });
  
  const colors = ['#6C63FF', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#EC4899', '#8B5CF6'];
  const deptData = Object.keys(deptCounts).map((name, i) => ({
    name,
    value: deptCounts[name],
    color: colors[i % colors.length]
  }));

  // Compute last 7 months trends
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Let's dynamically find the last 7 months
  const monthlyDataMap = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = monthNames[d.getMonth()];
    monthlyDataMap[mName] = { 
      month: mName, 
      scholars: 0, thesis: 0, viva: 0,
      submitted: 0, approved: 0, rejected: 0,
      active: 0, completed: 0, discontinued: 0 
    };
  }

  // Populate scholars (Research projects)
  projects.forEach(p => {
    if (p.startDate) {
      const date = new Date(p.startDate);
      if (!isNaN(date.getTime())) {
        const mName = monthNames[date.getMonth()];
        if (monthlyDataMap[mName]) {
          monthlyDataMap[mName].scholars += 1;
          if (p.status === 'Active') monthlyDataMap[mName].active += 1;
          else if (p.status === 'Completed') monthlyDataMap[mName].completed += 1;
          else if (p.status === 'Discontinued') monthlyDataMap[mName].discontinued += 1;
        }
      }
    }
  });

  // Populate thesis submissions
  submissions.forEach(s => {
    if (s.submittedAt) {
      const date = new Date(s.submittedAt);
      if (!isNaN(date.getTime())) {
        const mName = monthNames[date.getMonth()];
        if (monthlyDataMap[mName]) {
          monthlyDataMap[mName].thesis += 1;
          monthlyDataMap[mName].submitted += 1;
          const status = s.status || '';
          if (status.includes('Approved')) monthlyDataMap[mName].approved += 1;
          if (status.includes('Rejected') || status.includes('Revision')) monthlyDataMap[mName].rejected += 1;
        }
      }
    }
  });

  // Populate viva voce meetings
  meetings.forEach(m => {
    if (m.date) {
      const date = new Date(m.date);
      if (!isNaN(date.getTime())) {
        const mName = monthNames[date.getMonth()];
        if (monthlyDataMap[mName]) {
          monthlyDataMap[mName].viva += 1;
        }
      }
    }
  });

  const monthlyData = Object.values(monthlyDataMap);

  // Recent activity: get recent user events or mock them using actual database logs/submissions/meetings
  const recentActivities = [];
  
  // 1. Get recent users
  const recentUsers = await User.find().sort({ _id: -1 }).limit(3);
  recentUsers.forEach(u => {
    recentActivities.push({
      id: `u-${u._id}`,
      user: 'Admin',
      action: `Added new ${u.role}`,
      target: u.name,
      time: 'New',
      type: u.role === 'scholar' ? 'primary' : 'info'
    });
  });

  // 2. Get recent meetings
  const recentMeets = await Meeting.find().sort({ _id: -1 }).limit(2);
  recentMeets.forEach(m => {
    recentActivities.push({
      id: `m-${m._id}`,
      user: m.supervisor || 'DRC Convener',
      action: `Scheduled ${m.type}`,
      target: m.scholar,
      time: 'Recent',
      type: 'success'
    });
  });

  res.json({
    stats: {
      totalScholars,
      supervisors,
      activeResearch,
      pendingThesis,
      vivaScheduled,
      departments: allDepts.length
    },
    deptData,
    monthlyData,
    recentActivities: recentActivities.slice(0, 5),
    pendingActions: [
      { title: 'Synopsis Approvals', count: await Submission.countDocuments({ type: 'synopsis', status: 'Pending Supervisor Approval' }), color: '#F59E0B', icon: '📋' },
      { title: 'Thesis Reviews', count: pendingThesis, color: '#3B82F6', icon: '📚' },
      { title: 'Viva Scheduling', count: vivaScheduled, color: '#6C63FF', icon: '🎓' },
      { title: 'Active Accounts', count: await User.countDocuments({ status: 'Active' }), color: '#10B981', icon: '👥' }
    ]
  });
});

const scholarReport = asyncHandler(async (req, res) => {
  // TODO: VERIFY_INFERENCE Route is present in route-map.json but absent from api-spec.json.
  const name = new RegExp(req.query.name, 'i');
  const users = await User.find({ name, role: 'scholar' });
  const userIds = users.map((user) => user._id);
  const projects = await ResearchProject.find({ $or: [{ scholar: name }, { scholarId: { $in: userIds } }] });
  const submissions = await Submission.find({ scholarId: { $in: userIds } });

  res.json({ users: users.map((user) => user.toPublicJSON()), projects, submissions });
});

const generateReport = asyncHandler(async (req, res) => {
  // TODO: VERIFY_INFERENCE Route is present in route-map.json but absent from api-spec.json.
  const [usersByRole, researchByStatus, researchByStage, submissionsByStatus, vivaStats] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    ResearchProject.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, avgProgress: { $avg: '$progress' } } }]),
    ResearchProject.aggregate([{ $group: { _id: '$stage', count: { $sum: 1 } } }]),
    Submission.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Meeting.aggregate([{ $match: { type: 'Viva Voce' } }, { $group: { _id: '$status', count: { $sum: 1 } } }])
  ]);

  res.json({
    usersByRole,
    researchByStatus,
    researchByStage,
    submissionsByStatus,
    vivaStats
  });
});

module.exports = { getAdminDashboardStats, scholarReport, generateReport };
