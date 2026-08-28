const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');
const { logAudit } = require('../utils/auditLogger');
const { createNotification } = require('../utils/notificationHelper');

function publicUser(user) {
  return user.toPublicJSON ? user.toPublicJSON() : user;
}

const listUsers = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.role) filters.role = req.query.role.toLowerCase();
  if (req.query.status) filters.status = req.query.status;
  if (req.query.dept) filters.dept = req.query.dept;
  if (req.query.search) {
    const s = new RegExp(req.query.search, 'i');
    filters.$or = [{ name: s }, { email: s }];
  }

  // Filter by supervisor if requested or if queried by a supervisor (unless all=true is specified)
  if (req.query.supervisorId || req.query.supervisorName) {
    const orCond = [];
    if (req.query.supervisorId) orCond.push({ assignedSupervisorId: req.query.supervisorId });
    if (req.query.supervisorName) orCond.push({ assignedSupervisor: new RegExp(`^${req.query.supervisorName.trim()}$`, 'i') });
    if (orCond.length > 0) {
      filters.$or = orCond;
    }
  } else if (req.user?.role === 'supervisor' && req.query.all !== 'true') {
    filters.$or = [
      { assignedSupervisorId: req.user.id },
      { assignedSupervisor: new RegExp(`^${(req.user.name || '').trim()}$`, 'i') }
    ];
  }

  // Admin gets plainPassword field for the User Management table display
  const isAdmin = req.user?.role === 'admin';
  const query = User.find(filters).sort({ name: 1 });
  if (isAdmin) query.select('+plainPassword');

  const users = await query;
  res.json(users.map(u => u.toPublicJSON({ includePassword: isAdmin })));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('assignedSupervisorId', 'name email dept role profile');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user.toPublicJSON());
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Allow updating specific fields
  const allowedFields = ['name', 'phone', 'dob', 'gender', 'nationality', 'aadhaar', 'address', 'qualification', 'experience', 'regNo', 'batch', 'category', 'area'];
  
  // Initialize profile if undefined
  if (!user.profile) user.profile = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      if (['name'].includes(field)) {
        user[field] = req.body[field];
      } else {
        user.profile[field] = req.body[field];
      }
    }
  });

  user.isProfileCompleted = true;
  await user.save();

  await logAudit({
    user: user.name,
    action: 'Profile Updated',
    detail: 'User updated their profile',
    severity: 'Info'
  });

  // Populate supervisor for the return payload
  await user.populate('assignedSupervisorId', 'name email dept role profile');
  res.json(user.toPublicJSON());
});

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const exists = await User.exists({ email });
  if (exists) {
    throw new AppError('Email already exists', 400);
  }

  const joined = req.body.joined || new Date().toISOString().slice(0, 10);
  const role = req.body.role?.toLowerCase();
  const user = await User.create({ ...req.body, email, role, joined });
  
  await logAudit({
    user: req.user?.name || 'System',
    action: 'User Created',
    detail: `Created user account for ${user.name} (${user.role})`,
    severity: 'Info'
  });

  // Re-fetch with plainPassword so admin can see the credentials
  const fresh = await User.findById(user._id).select('+plainPassword');
  res.status(201).json(fresh.toPublicJSON({ includePassword: true }));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password +plainPassword');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Handle role normalization
  if (req.body.role) req.body.role = req.body.role.toLowerCase();
  if (req.body.email) req.body.email = req.body.email.toLowerCase();

  Object.assign(user, req.body);
  await user.save();
  
  await logAudit({
    user: req.user?.name || 'System',
    action: 'User Updated',
    detail: `Updated user account details for ${user.name}`,
    severity: 'Info'
  });

  const fresh = await User.findById(user._id).select('+plainPassword');
  res.json(fresh.toPublicJSON({ includePassword: true }));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await logAudit({
    user: req.user?.name || 'System',
    action: 'User Deleted',
    detail: `Deleted user account for ${user.name}`,
    severity: 'Warning'
  });

  res.json({ success: true });
});

const assignSupervisor = asyncHandler(async (req, res) => {
  const [scholar, supervisor] = await Promise.all([
    User.findOne({ _id: req.params.scholarId, role: 'scholar' }),
    User.findOne({ _id: req.body.supervisorId, role: 'supervisor' })
  ]);

  if (!scholar || !supervisor) {
    throw new AppError('Scholar or Supervisor not found', 404);
  }

  scholar.assignedSupervisor = supervisor.name;
  scholar.assignedSupervisorId = supervisor._id;
  await scholar.save();

  // Log Audit
  await logAudit({
    user: req.user?.name || 'System',
    action: 'Scholar Assigned',
    detail: `Assigned scholar ${scholar.name} to supervisor ${supervisor.name}`,
    severity: 'Success'
  });

  // Create notifications for both scholar and supervisor
  await createNotification({
    userId: scholar._id,
    title: 'Supervisor Assigned',
    message: `${supervisor.name} has been assigned as your supervisor.`,
    type: 'allocation'
  });

  await createNotification({
    userId: supervisor._id,
    title: 'Scholar Assigned',
    message: `Scholar ${scholar.name} has been assigned to you.`,
    type: 'allocation'
  });

  res.json({
    id: scholar._id,
    name: scholar.name,
    role: 'scholar',
    assignedSupervisor: scholar.assignedSupervisor,
    assignedSupervisorId: scholar.assignedSupervisorId
  });
});

const unassignSupervisor = asyncHandler(async (req, res) => {
  const scholar = await User.findOne({ _id: req.params.scholarId, role: 'scholar' });
  if (!scholar) {
    throw new AppError('Scholar not found', 404);
  }

  const supervisorId = scholar.assignedSupervisorId;
  const supervisorName = scholar.assignedSupervisor;

  scholar.assignedSupervisor = undefined;
  scholar.assignedSupervisorId = undefined;
  await scholar.save();

  // Log Audit
  await logAudit({
    user: req.user?.name || 'System',
    action: 'Scholar Unassigned',
    detail: `Unlinked scholar ${scholar.name} from supervisor ${supervisorName}`,
    severity: 'Warning'
  });

  // Notifications
  await createNotification({
    userId: scholar._id,
    title: 'Supervisor Unassigned',
    message: `You have been unassigned from supervisor ${supervisorName}.`,
    type: 'allocation'
  });

  if (supervisorId) {
    await createNotification({
      userId: supervisorId,
      title: 'Scholar Unassigned',
      message: `Scholar ${scholar.name} is no longer assigned to you.`,
      type: 'allocation'
    });
  }

  res.json({
    id: scholar._id,
    name: scholar.name,
    role: 'scholar',
    assignedSupervisor: null,
    assignedSupervisorId: null
  });
});

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  assignSupervisor,
  unassignSupervisor,
  getMe,
  updateMe
};
