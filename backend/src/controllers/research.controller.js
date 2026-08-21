const ResearchProject = require('../models/ResearchProject.model');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function formatProject(project) {
  const doc = project.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

async function resolveProjectUsers(payload) {
  const next = { ...payload };

  // TODO: VERIFY_INFERENCE api-spec.json accepts names, while db-schema.json requires ObjectId references.
  if (!next.scholarId) {
    const scholar = await User.findOne({ name: next.scholar, role: 'scholar' });
    if (!scholar) throw new AppError('Scholar user not found for supplied scholar name', 400);
    next.scholarId = scholar._id;
  }

  if (!next.supervisorId) {
    const supervisor = await User.findOne({ name: next.supervisor, role: 'supervisor' });
    if (!supervisor) throw new AppError('Supervisor user not found for supplied supervisor name', 400);
    next.supervisorId = supervisor._id;
  }

  return next;
}

async function resolveSupervisor(payload) {
  const next = { ...payload };

  if (next.supervisor && !next.supervisorId) {
    const supervisor = await User.findOne({ name: next.supervisor, role: 'supervisor' });
    if (!supervisor) throw new AppError('Supervisor user not found for supplied supervisor name', 400);
    next.supervisorId = supervisor._id;
  }

  return next;
}

const listResearch = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.stage) filters.stage = req.query.stage;
  if (req.query.scholarId) filters.scholarId = req.query.scholarId;

  if (req.user.role === 'scholar' && !req.query.all) {
    filters.$or = [{ scholarId: req.user.id }, { scholar: req.user.name }];
  }

  const projects = await ResearchProject.find(filters).sort({ createdAt: -1 });
  res.json(projects.map(formatProject));
});

const createResearch = asyncHandler(async (req, res) => {
  const payload = await resolveProjectUsers(req.body);
  const project = await ResearchProject.create(payload);
  res.status(201).json(formatProject(project));
});

const updateResearch = asyncHandler(async (req, res) => {
  const payload = await resolveSupervisor(req.body);

  const project = await ResearchProject.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!project) {
    throw new AppError('Research project not found', 404);
  }

  res.json(formatProject(project));
});

const deleteResearch = asyncHandler(async (req, res) => {
  const project = await ResearchProject.findByIdAndDelete(req.params.id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json({ success: true });
});

module.exports = { listResearch, createResearch, updateResearch, deleteResearch };
