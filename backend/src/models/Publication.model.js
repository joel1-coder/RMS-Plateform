const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema(
  {
    scholar: { type: String, required: true, trim: true },
    scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    journal: { type: String, required: true, trim: true },
    pubType: { type: String, required: true, trim: true }, // e.g. Journal Publishing, Patent, Chapters
    doi: { type: String, trim: true },
    status: {
      type: String,
      required: true,
      default: 'Submitted'
    },
    date: { type: String, required: true },
    fileUrl: { type: String }
  },
  { timestamps: true }
);

publicationSchema.index({ scholarId: 1 });
publicationSchema.index({ status: 1 });

module.exports = mongoose.model('Publication', publicationSchema, 'publications');
