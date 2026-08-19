const mongoose = require('mongoose');

const thesisSchema = new mongoose.Schema(
  {
    scholar: { type: String, required: true, trim: true },
    scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    supervisor: { type: String, required: true, trim: true },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    submittedAt: { type: String, required: true },
    fileUrl: { type: String, required: true },
    remarks: { type: String, trim: true }
  },
  { timestamps: true }
);

thesisSchema.index({ scholarId: 1 });
thesisSchema.index({ supervisorId: 1 });
thesisSchema.index({ status: 1 });

module.exports = mongoose.model('Thesis', thesisSchema, 'theses');
