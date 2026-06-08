// ── users.js ──
const express  = require('express');
const User     = require('../models/User');
const Patient  = require('../models/Patient');
const { protect } = require('../middleware/auth');
const router   = express.Router();

router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

router.put('/me', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Patient profile
router.post('/patient', protect, async (req, res) => {
  try {
    const existing = await Patient.findOne({ user: req.user._id });
    if (existing) {
      const updated = await Patient.findByIdAndUpdate(existing._id, req.body, { new: true });
      return res.json({ success: true, patient: updated });
    }
    const patient = await Patient.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, patient });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/patient', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    res.json({ success: true, patient });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
