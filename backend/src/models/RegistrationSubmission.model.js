const mongoose = require('mongoose');

const registrationSubmissionSchema = new mongoose.Schema(
  {
    scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestAccount', required: true },
    formData: { type: Object, required: true }, // Contains all filled scholar registration details
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    rejectionReason: { type: String, default: '' },
    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RegistrationSubmission', registrationSubmissionSchema, 'registration_submissions');
