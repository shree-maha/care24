const express   = require('express');
const User      = require('../models/User');
const Caregiver = require('../models/Caregiver');
const Booking   = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const router    = express.Router();

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalCaregivers, totalBookings, pendingVerifications] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Caregiver.countDocuments({ status: 'verified' }),
      Booking.countDocuments(),
      Caregiver.countDocuments({ status: 'pending' }),
    ]);
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const completionRate = totalBookings ? Math.round((completedBookings / totalBookings) * 100) : 0;
    res.json({ success: true, stats: { totalUsers, totalCaregivers, totalBookings, pendingVerifications, completionRate } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/admin/pending-caregivers
router.get('/pending-caregivers', protect, adminOnly, async (req, res) => {
  try {
    const caregivers = await Caregiver.find({ status: 'pending' }).populate('user', '-password');
    res.json({ success: true, caregivers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/admin/caregivers/:id/verify
router.put('/caregivers/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' | 'reject'
    const status = action === 'approve' ? 'verified' : 'rejected';
    const cg = await Caregiver.findByIdAndUpdate(req.params.id, { status, isVerified: status === 'verified' }, { new: true });
    if (!cg) return res.status(404).json({ success: false, message: 'Caregiver not found' });
    res.json({ success: true, caregiver: cg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/admin/bookings
router.get('/bookings', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName')
      .populate({ path: 'caregiver', populate: { path: 'user', select: 'firstName lastName' } })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, bookings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
