const AuditLog = require('../models/AuditLog.model');

async function logAudit({ user, action, detail, ipAddress = '127.0.0.1', severity = 'Info' }) {
  try {
    await AuditLog.create({ user, action, detail, ipAddress, severity });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

module.exports = { logAudit };
