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

async function createSubmission(req, res, type) {
  if (!req.file) {
    throw new AppError('Missing file attachment', 400);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('Scholar not found', 404);
  }

  const status = type === 'synopsis' ? 'Pending Supervisor Approval' : 'Pending Supervisor Approval';
  const submission = await Submission.create({
    scholarId: user._id,
    scholarName: user.name,
    topic: req.body.topic,
    type,
    fileUrl: publicFileUrl(req.file, type),
    status,
    submittedAt: new Date().toISOString()
  });

  res.status(201).json(formatSubmission(submission));
}

const submitSynopsis = asyncHandler(async (req, res) => {
  await createSubmission(req, res, 'synopsis');
});

const submitThesis = asyncHandler(async (req, res) => {
  // TODO: VERIFY_INFERENCE Route is present in route-map.json but absent from api-spec.json.
  await createSubmission(req, res, 'thesis');
});

const updateSynopsisStatus = asyncHandler(async (req, res) => {
  const submission = await Submission.findOneAndUpdate(
    { _id: req.params.id, type: 'synopsis' },
    { status: req.body.status, remarks: req.body.remarks },
    { new: true, runValidators: true }
  );

  if (!submission) {
    throw new AppError('Synopsis submission not found', 404);
  }

  res.json(formatSubmission(submission));
});

module.exports = { submitSynopsis, submitThesis, updateSynopsisStatus };
