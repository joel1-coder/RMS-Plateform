const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    scholarId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    scholarName: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['synopsis', 'thesis', 'progress_report', 'document'] },
    version: { type: String, default: 'v1.0' },
    period: { type: String, trim: true },
    category: { type: String, trim: true },
    workDone: { type: String, trim: true },
    planNext: { type: String, trim: true },
    drcMeetingDate: { type: String, trim: true },
    approvalDate: { type: String, trim: true },
    originalName: { type: String, trim: true },
    size: { type: String, trim: true },
    fileUrl: { type: String, required: true },
    status: {
      type: String,
      required: true,
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
