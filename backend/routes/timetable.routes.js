const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// GET all timetables
router.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ createdAt: -1 }).select('-__v');
    res.json({ success: true, count: timetables.length, data: timetables });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single timetable
router.get('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ success: false, error: 'Timetable not found' });
    res.json({ success: true, data: timetable });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create timetable
router.post('/', async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.status(201).json({ success: true, data: timetable, message: 'Timetable saved successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update timetable
router.put('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!timetable) return res.status(404).json({ success: false, error: 'Timetable not found' });
    res.json({ success: true, data: timetable, message: 'Timetable updated!' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE timetable
router.delete('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) return res.status(404).json({ success: false, error: 'Timetable not found' });
    res.json({ success: true, message: 'Timetable deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
