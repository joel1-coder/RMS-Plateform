const AuditLog = require('../models/AuditLog.model');
const { asyncHandler } = require('../middlewares/errorHandler');

const getAuditLogs = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.severity && req.query.severity !== 'All') filters.severity = req.query.severity;
  if (req.query.search) {
    const s = new RegExp(req.query.search, 'i');
    filters.$or = [{ user: s }, { action: s }, { detail: s }];
  }

  const logs = await AuditLog.find(filters).sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

module.exports = { getAuditLogs };
