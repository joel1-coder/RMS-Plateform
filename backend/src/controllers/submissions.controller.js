const Submission = require('../models/Submission.model');
const User = require('../models/User.model');
const { AppError, asyncHandler } = require('../middlewares/errorHandler');
const { publicFileUrl } = require('../services/storageService');

function formatSubmission(submission) {
  const doc = submission.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

const listSubmissions = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.type) filters.type = req.query.type;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.scholarId) filters.scholarId = req.query.scholarId;

  // Scholars only see their own submissions
  if (req.user.role === 'scholar') {
    filters.scholarId = req.user.id;
  }

  const submissions = await Submission.find(filters).sort({ createdAt: -1 });
  res.json(submissions.map(formatSubmission));
});

async function createSubmission(req, res, type) {
  if (!req.file) {
    throw new AppError('Missing file attachment', 400);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('Scholar not found', 404);
  }

  const defaultStatus = type === 'document' ? 'Verified' : 'Pending Supervisor Approval';
  const sizeMB = req.file.size ? (req.file.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.0 MB';

  const submission = await Submission.create({
    scholarId: user._id,
    scholarName: user.name,
    topic: req.body.topic || req.body.title || 'Research Document',
    type,
    version: req.body.version || 'v1.0',
    period: req.body.period || '',
    category: req.body.category || 'Synopsis',
    workDone: req.body.workDone || '',
    planNext: req.body.planNext || '',
    originalName: req.file.originalname,
    size: sizeMB,
    fileUrl: publicFileUrl(req.file, type),
    status: req.body.status || defaultStatus,
    remarks: req.body.remarks || '',
    submittedAt: new Date().toISOString()
  });

  res.status(201).json(formatSubmission(submission));
}

const submitSynopsis = asyncHandler(async (req, res) => {
  await createSubmission(req, res, 'synopsis');
});

const submitThesis = asyncHandler(async (req, res) => {
  await createSubmission(req, res, 'thesis');
});

const submitProgressReport = asyncHandler(async (req, res) => {
  await createSubmission(req, res, 'progress_report');
});

const submitDocument = asyncHandler(async (req, res) => {
  await createSubmission(req, res, 'document');
});

const updateSynopsisStatus = asyncHandler(async (req, res) => {
  const updateData = { status: req.body.status };
  if (req.body.remarks !== undefined) updateData.remarks = req.body.remarks;
  if (req.body.drcMeetingDate) updateData.drcMeetingDate = req.body.drcMeetingDate;
  if (req.body.approvalDate) updateData.approvalDate = req.body.approvalDate;

  const submission = await Submission.findOneAndUpdate(
    { _id: req.params.id },
    updateData,
    { new: true, runValidators: true }
  );

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  res.json(formatSubmission(submission));
});

const deleteSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  if (req.user.role === 'scholar' && submission.scholarId.toString() !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  await Submission.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Submission deleted' });
});

module.exports = {
  listSubmissions,
  submitSynopsis,
  submitThesis,
  submitProgressReport,
  submitDocument,
  updateSynopsisStatus,
  deleteSubmission
};
