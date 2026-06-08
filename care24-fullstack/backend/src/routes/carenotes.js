const express   = require('express');
const CareNote  = require('../models/CareNote');
const Caregiver = require('../models/Caregiver');
const { protect, caregiverOnly } = require('../middleware/auth');
const router    = express.Router();

// POST /api/carenotes — caregiver adds note
router.post('/', protect, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOne({ user: req.user._id });
    const note = await CareNote.create({ ...req.body, caregiver: cg._id });
    res.status(201).json({ success: true, note });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/carenotes/:bookingId — get notes for a booking
router.get('/:bookingId', protect, async (req, res) => {
  try {
    const notes = await CareNote.find({ booking: req.params.bookingId })
      .populate({ path: 'caregiver', populate: { path: 'user', select: 'firstName lastName' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
