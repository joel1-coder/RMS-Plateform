const Thesis = require('../models/Thesis.model');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function formatThesis(thesis) {
  const doc = thesis.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

const listTheses = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.scholarId) filters.scholarId = req.query.scholarId;
  if (req.query.supervisorId) filters.supervisorId = req.query.supervisorId;

  if (req.query.search) {
    const s = new RegExp(req.query.search, 'i');
    filters.$or = [{ scholar: s }, { title: s }];
  }

  const theses = await Thesis.find(filters).sort({ createdAt: -1 });
  res.json(theses.map(formatThesis));
});

const createThesis = asyncHandler(async (req, res) => {
  let scholarId;
  let supervisorId;
  let scholarName;
  let supervisorName;

  if (req.user.role === 'scholar') {
    scholarId = req.user.id;
    const scholar = await User.findById(scholarId);
    if (!scholar) throw new AppError('Scholar user not found', 404);
    scholarName = scholar.name;
    supervisorName = scholar.assignedSupervisor || 'None';
    supervisorId = scholar.assignedSupervisorId || scholarId;
  } else {
    // Supervisor or Admin uploading on behalf of a scholar
    scholarId = req.body.scholarId;
    if (!scholarId) throw new AppError('scholarId is required when uploading as supervisor/admin', 400);
    const scholar = await User.findById(scholarId);
    if (!scholar) throw new AppError('Scholar user not found', 404);
    scholarName = scholar.name;
    
    // Set supervisor to the logged-in user if they are a supervisor
    if (req.user.role === 'supervisor') {
      supervisorId = req.user.id;
      supervisorName = req.user.name;
    } else {
      supervisorName = scholar.assignedSupervisor || 'None';
      supervisorId = scholar.assignedSupervisorId || req.user.id;
    }
  }

  const payload = {
    scholar: scholarName,
    scholarId: scholarId,
    title: req.body.title || 'Untitled Thesis',
    supervisor: supervisorName,
    supervisorId: supervisorId,
    status: 'Pending',
    submittedAt: new Date().toISOString().slice(0, 10),
    fileUrl: req.file ? `/uploads/thesis/${req.file.filename}` : (req.body.fileUrl || '')
  };

  const thesis = await Thesis.create(payload);
  res.status(201).json(formatThesis(thesis));
});

const updateThesis = asyncHandler(async (req, res) => {
  const thesis = await Thesis.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!thesis) throw new AppError('Thesis entry not found', 404);
  res.json(formatThesis(thesis));
});

const deleteThesis = asyncHandler(async (req, res) => {
  const thesis = await Thesis.findByIdAndDelete(req.params.id);
  if (!thesis) throw new AppError('Thesis entry not found', 404);
  res.json({ success: true });
});

module.exports = { listTheses, createThesis, updateThesis, deleteThesis };
