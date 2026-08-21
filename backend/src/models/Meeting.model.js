const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    scholar: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true, trim: true },
    mode: { type: String, trim: true, default: 'offline' },
    agenda: { type: String, trim: true },
    panel: { type: String, trim: true },
    supervisor: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
  },
  { timestamps: true }
);

meetingSchema.index({ date: 1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ type: 1 });

module.exports = mongoose.model('Meeting', meetingSchema, 'meetings');
