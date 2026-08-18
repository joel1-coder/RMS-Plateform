const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function publicUser(user) {
  return user.toPublicJSON ? user.toPublicJSON() : user;
}

const listUsers = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.role) filters.role = req.query.role;
  if (req.query.status) filters.status = req.query.status;

  const users = await User.find(filters).sort({ name: 1 });
  res.json(users.map(publicUser));
});

const createUser = asyncHandler(async (req, res) => {
  const exists = await User.exists({ email: req.body.email.toLowerCase() });
  if (exists) {
    throw new AppError('Email already exists', 400);
  }

  const user = await User.create(req.body);
  res.status(201).json(publicUser(user));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  Object.assign(user, req.body);
  await user.save();
  res.json(publicUser(user));
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
