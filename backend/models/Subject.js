const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  periodsPerWeek: { type: Number, required: true, min: 1, max: 30 },
  color:          { type: String, default: '#4361ee' }
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
