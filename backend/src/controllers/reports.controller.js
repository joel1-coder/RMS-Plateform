const ResearchProject = require('../models/ResearchProject.model');
const Submission = require('../models/Submission.model');
const Meeting = require('../models/Meeting.model');
const User = require('../models/User.model');
const { asyncHandler } = require('../middlewares/errorHandler');

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

module.exports = { scholarReport, generateReport };
