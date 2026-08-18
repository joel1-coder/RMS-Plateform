const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    scholarId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    scholarName: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['synopsis', 'thesis'] },
    fileUrl: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending Supervisor Approval', 'Approved by Supervisor', 'Pending DRC Review', 'Approved by DRC', 'Needs DRC Revision'],
      default: 'Pending Supervisor Approval'
    },
    remarks: { type: String, trim: true },
    submittedAt: { type: String, required: true }
  },
  { timestamps: true }
);

submissionSchema.index({ scholarId: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ type: 1 });

module.exports = mongoose.model('Submission', submissionSchema, 'submissions');
