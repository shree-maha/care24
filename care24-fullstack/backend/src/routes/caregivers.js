const express   = require('express');
const Caregiver = require('../models/Caregiver');
const User      = require('../models/User');
const { protect, adminOnly, caregiverOnly } = require('../middleware/auth');
const router    = express.Router();

// GET /api/caregivers — public, browse all verified caregivers
router.get('/', async (req, res) => {
  try {
    const { service, location, available } = req.query;
    const filter = { status: 'verified' };
    if (service)   filter.services  = { $in: [service] };
    if (location)  filter.location  = new RegExp(location, 'i');
    if (available) filter.isAvailable = available === 'true';

    const caregivers = await Caregiver.find(filter)
      .populate('user', 'firstName lastName email phone')
      .sort({ rating: -1 });

    res.json({ success: true, count: caregivers.length, caregivers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/caregivers/me — caregiver's own profile
router.get('/me', protect, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOne({ user: req.user._id }).populate('user', '-password');
    if (!cg) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, caregiver: cg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/caregivers/me — update own profile
router.put('/me', protect, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true }
    ).populate('user', '-password');
    res.json({ success: true, caregiver: cg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/caregivers/availability — toggle availability
router.put('/availability', protect, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOne({ user: req.user._id });
    cg.isAvailable = !cg.isAvailable;
    await cg.save();
    res.json({ success: true, isAvailable: cg.isAvailable });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/caregivers/:id — public single profile
router.get('/:id', async (req, res) => {
  try {
    const cg = await Caregiver.findById(req.params.id).populate('user', 'firstName lastName email phone');
    if (!cg) return res.status(404).json({ success: false, message: 'Caregiver not found' });
    res.json({ success: true, caregiver: cg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
