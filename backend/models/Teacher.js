const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  email:   { type: String, trim: true, default: '' },
  phone:   { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
