const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  uniName: { type: String, default: 'University of Excellence' },
  uniCode: { type: String, default: 'UOE-2024' },
  address: { type: String, default: '123 Research Park, Tech City - 560001' },
  phone: { type: String, default: '+91 80 2222 3333' },
  email: { type: String, default: 'admin@uoe.edu' },
  website: { type: String, default: 'https://www.uoe.edu' },
  synopsisDeadline: { type: String, default: '2024-09-30' },
  thesisDeadline: { type: String, default: '2024-12-31' },
  vivaWindow: { type: String, default: '30' },
  maxScholarsPerSupervisor: { type: String, default: '6' },
  minResearchYears: { type: String, default: '3' },
  maxResearchYears: { type: String, default: '6' },
  smtpHost: { type: String, default: 'smtp.gmail.com' },
  smtpPort: { type: String, default: '587' },
  smtpUser: { type: String, default: 'noreply@uoe.edu' },
  smtpPass: { type: String, default: '' },
  emailNotifications: { type: Boolean, default: true },
  twoFactor: { type: Boolean, default: false },
  sessionTimeout: { type: String, default: '60' },
  allowSelfReg: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
