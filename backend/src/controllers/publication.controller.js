const Publication = require('../models/Publication.model');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');

function formatPub(pub) {
  const doc = pub.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

const listPublications = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.scholarId) filters.scholarId = req.query.scholarId;

  if (req.query.search) {
    const s = new RegExp(req.query.search, 'i');
    filters.$or = [{ scholar: s }, { title: s }, { journal: s }];
  }

  const pubs = await Publication.find(filters).sort({ date: -1 });
  res.json(pubs.map(formatPub));
});

const createPublication = asyncHandler(async (req, res) => {
  const scholarId = req.user.id;
  const scholar = await User.findById(scholarId);
  if (!scholar) throw new AppError('Scholar user not found', 404);

  const journalVal = req.body.journal || 
                     req.body.journalName || 
                     req.body.conferenceName || 
                     req.body.bookTitle || 
                     req.body.bookAuthoredTitle || 
                     req.body.bookEditedTitle || 
                     req.body.patentOffice || 
                     req.body.copyrightOffice || 
                     'Unknown';

  const payload = {
    scholar: scholar.name,
    scholarId: scholar._id,
    title: req.body.title || 'Untitled Publication',
    journal: journalVal,
    pubType: req.body.pubType || req.body.type || 'Journal Publishing',
    doi: req.body.doi || '',
    status: req.body.status || 'Submitted',
    date: req.body.date || new Date().toISOString().slice(0, 10),
    fileUrl: req.file ? `/uploads/${req.file.filename}` : (req.body.fileUrl || '')
  };

  const pub = await Publication.create(payload);
  res.status(201).json(formatPub(pub));
});

const updatePublication = asyncHandler(async (req, res) => {
  const pub = await Publication.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!pub) throw new AppError('Publication not found', 404);
  res.json(formatPub(pub));
});

const deletePublication = asyncHandler(async (req, res) => {
  const pub = await Publication.findByIdAndDelete(req.params.id);
  if (!pub) throw new AppError('Publication not found', 404);
  res.json({ success: true });
});

module.exports = { listPublications, createPublication, updatePublication, deletePublication };
