const express   = require('express');
const Booking   = require('../models/Booking');
const Caregiver = require('../models/Caregiver');
const { protect, caregiverOnly, adminOnly } = require('../middleware/auth');
const router    = express.Router();

// POST /api/bookings — create booking (user)
router.post('/', protect, async (req, res) => {
  try {
    const { caregiverId, service, careType, date, time, duration, address, notes, patientId } = req.body;
    const cg = await Caregiver.findById(caregiverId);
    if (!cg) return res.status(404).json({ success: false, message: 'Caregiver not found' });
    const totalAmount = Math.round(cg.pricePerHour * duration);
    const booking = await Booking.create({
      user: req.user._id, caregiver: caregiverId, patient: patientId,
      service, careType, date, time, duration, address, notes, totalAmount,
    });
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/my — user's own bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'caregiver', populate: { path: 'user', select: 'firstName lastName' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/caregiver — caregiver's bookings
router.get('/caregiver', protect, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOne({ user: req.user._id });
    if (!cg) return res.status(404).json({ success: false, message: 'Caregiver profile not found' });
    const bookings = await Booking.find({ caregiver: cg._id })
      .populate('user', 'firstName lastName phone')
      .populate('patient')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/bookings/:id/status — update booking status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, progress } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (status)   booking.status   = status;
    if (progress !== undefined) booking.progress = progress;
    await booking.save();

    // Update caregiver earnings if completed
    if (status === 'completed') {
      await Caregiver.findByIdAndUpdate(booking.caregiver, {
        $inc: { earnings: booking.totalAmount, totalBookings: 1 }
      });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id — single booking detail
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'caregiver', populate: { path: 'user', select: 'firstName lastName phone' } })
      .populate('user', 'firstName lastName phone')
      .populate('patient');
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
