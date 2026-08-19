const VivaVoce = require('../models/VivaVoce.model');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function formatViva(viva) {
  const doc = viva.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

async function resolveVivaUsers(payload) {
  const next = { ...payload };

  if (!next.scholarId && next.scholar) {
    const scholar = await User.findOne({ name: { $regex: new RegExp(`^${next.scholar}$`, 'i') }, role: 'scholar' });
    if (!scholar) throw new AppError(`Scholar user "${next.scholar}" not found`, 400);
    next.scholarId = scholar._id;
    next.dept = scholar.dept;
  }

  if (!next.supervisorId && next.supervisor) {
    const supervisor = await User.findOne({ name: { $regex: new RegExp(`^${next.supervisor}$`, 'i') }, role: 'supervisor' });
    if (!supervisor) throw new AppError(`Supervisor user "${next.supervisor}" not found`, 400);
    next.supervisorId = supervisor._id;
  }

  return next;
}

const listVivas = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.scholarId) filters.scholarId = req.query.scholarId;
  if (req.query.supervisorId) filters.supervisorId = req.query.supervisorId;

  if (req.query.search) {
    const s = new RegExp(req.query.search, 'i');
    filters.$or = [{ scholar: s }, { dept: s }, { thesis: s }];
  }

  const vivas = await VivaVoce.find(filters).sort({ date: 1, time: 1 });
  res.json(vivas.map(formatViva));
});

const createViva = asyncHandler(async (req, res) => {
  const payload = await resolveVivaUsers(req.body);
  const viva = await VivaVoce.create(payload);
  res.status(201).json(formatViva(viva));
});

const updateViva = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.scholar || payload.supervisor) {
    Object.assign(payload, await resolveVivaUsers(payload));
  }

  const viva = await VivaVoce.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!viva) throw new AppError('Viva Voce entry not found', 404);
  res.json(formatViva(viva));
});

const deleteViva = asyncHandler(async (req, res) => {
  const viva = await VivaVoce.findByIdAndDelete(req.params.id);
  if (!viva) throw new AppError('Viva Voce entry not found', 404);
  res.json({ success: true });
});

module.exports = { listVivas, createViva, updateViva, deleteViva };
