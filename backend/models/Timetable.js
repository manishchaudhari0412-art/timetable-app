const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  label: String,
  start: String,
  end:   String
});

const BreakSchema = new mongoose.Schema({
  afterPeriod: Number,
  label:       String,
  start:       String,
  end:         String
});

const TimetableSchema = new mongoose.Schema({
  institutionName: { type: String, required: true, trim: true },
  institutionType: { type: String, enum: ['School', 'College'], default: 'School' },
  academicYear:    { type: String, default: '2025-26' },
  workingDays:     { type: Number, default: 6 },
  numClasses:      { type: Number, default: 3 },
  numDivisions:    { type: Number, default: 2 },
  studentsPerDiv:  { type: Number, default: 40 },
  startingRoom:    { type: Number, default: 101 },
  subjects:        [{ name: String, periodsPerWeek: Number }],
  teachers:        [{ name: String, subject: String }],
  slots:           [SlotSchema],
  breaks:          [BreakSchema],
  generatedAt:     { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
