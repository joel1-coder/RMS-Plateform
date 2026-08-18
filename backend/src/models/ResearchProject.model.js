const mongoose = require('mongoose');

const researchProjectSchema = new mongoose.Schema(
  {
    scholar: { type: String, required: true, trim: true },
    scholarId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    topic: { type: String, required: true, trim: true },
    supervisor: { type: String, required: true, trim: true },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    dept: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    stage: {
      type: String,
      required: true,
      enum: ['Course Work', 'Synopsis Preparation', 'Literature Review', 'Data Collection', 'Thesis Writing', 'Viva Voce', 'Completed'],
      default: 'Course Work'
    },
    progress: { type: Number, required: true, min: 0, max: 100, default: 0 },
    status: { type: String, required: true, enum: ['Active', 'Completed', 'Discontinued'], default: 'Active' }
  },
  { timestamps: true }
);

researchProjectSchema.index({ scholarId: 1 });
researchProjectSchema.index({ supervisorId: 1 });
researchProjectSchema.index({ status: 1 });
researchProjectSchema.index({ stage: 1 });

module.exports = mongoose.model('ResearchProject', researchProjectSchema, 'research_projects');
