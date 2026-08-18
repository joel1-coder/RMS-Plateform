const mongoose = require('mongoose');

const minuteSchema = new mongoose.Schema(
  {
    committee: { type: String, required: true, trim: true },
    meetingDate: { type: String, required: true },
    agenda: { type: String, required: true, trim: true },
    decisions: { type: String, required: true, trim: true },
    writer: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['Draft', 'Signed'], default: 'Draft' }
  },
  { timestamps: true }
);

minuteSchema.index({ meetingDate: 1 });
minuteSchema.index({ status: 1 });

module.exports = mongoose.model('Minute', minuteSchema, 'minutes');
