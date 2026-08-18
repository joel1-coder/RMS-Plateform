const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema(
  {
    uniName: { type: String, required: true, trim: true },
    uniCode: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    synopsisDeadline: { type: String, required: true },
    thesisDeadline: { type: String, required: true },
    vivaWindow: { type: String, required: true },
    maxScholarsPerSupervisor: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSetting', systemSettingSchema, 'system_settings');
