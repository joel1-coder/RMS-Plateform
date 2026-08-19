const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    detail: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
    severity: {
      type: String,
      required: true,
      enum: ['Info', 'Success', 'Warning', 'Critical'],
      default: 'Info'
    },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ severity: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema, 'audit_logs');
