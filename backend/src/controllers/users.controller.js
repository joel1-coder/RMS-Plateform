const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function publicUser(user) {
  return user.toPublicJSON ? user.toPublicJSON() : user;
}

const listUsers = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.role) filters.role = req.query.role.toLowerCase();
  if (req.query.status) filters.status = req.query.status;
  if (req.query.search) {
    const s = new RegExp(req.query.search, 'i');
    filters.$or = [{ name: s }, { email: s }];
  }

  // Admin gets plainPassword field for the User Management table display
  const isAdmin = req.user?.role === 'admin';
  const query = User.find(filters).sort({ name: 1 });
  if (isAdmin) query.select('+plainPassword');

  const users = await query;
  res.json(users.map(u => u.toPublicJSON({ includePassword: isAdmin })));
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
  
  const fresh = await User.findById(user._id).select('+plainPassword');
  res.json(fresh.toPublicJSON({ includePassword: true }));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

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

  res.json({
    id: scholar._id,
    name: scholar.name,
    role: 'Scholar',
    assignedSupervisor: scholar.assignedSupervisor,
    assignedSupervisorId: scholar.assignedSupervisorId
  });
});

const unassignSupervisor = asyncHandler(async (req, res) => {
  const scholar = await User.findOne({ _id: req.params.scholarId, role: 'scholar' });
  if (!scholar) {
    throw new AppError('Scholar not found', 404);
  }

  scholar.assignedSupervisor = undefined;
  scholar.assignedSupervisorId = undefined;
  await scholar.save();

  res.json({
    id: scholar._id,
    name: scholar.name,
    role: 'Scholar',
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
  unassignSupervisor
};
