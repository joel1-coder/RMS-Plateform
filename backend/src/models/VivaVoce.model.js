const mongoose = require('mongoose');

const vivaVoceSchema = new mongoose.Schema(
  {
    scholar: { type: String, required: true, trim: true },
    scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thesis: { type: String, required: true, trim: true },
    supervisor: { type: String, required: true, trim: true },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dept: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true, trim: true },
    panel: { type: String, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['Scheduled', 'Completed', 'Pending', 'Cancelled'],
      default: 'Pending'
    },
    instructions: { type: String, trim: true }
  },
  { timestamps: true }
);

vivaVoceSchema.index({ scholarId: 1 });
vivaVoceSchema.index({ supervisorId: 1 });
vivaVoceSchema.index({ status: 1 });

module.exports = mongoose.model('VivaVoce', vivaVoceSchema, 'viva_voces');
