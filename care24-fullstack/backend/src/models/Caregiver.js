const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qualification: { type: String, required: true },
  experience:    { type: Number, default: 0 },
  services:      [{ type: String }],
  location:      { type: String },
  serviceAreas:  [{ type: String }],
  pricePerHour:  { type: Number, default: 800 },
  bio:           { type: String },
  rating:        { type: Number, default: 0 },
  totalReviews:  { type: Number, default: 0 },
  isAvailable:   { type: Boolean, default: true },
  isVerified:    { type: Boolean, default: false },
  status:        { type: String, enum: ['pending', 'verified', 'rejected', 'suspended'], default: 'pending' },
  documents:     [{ name: String, url: String, verified: Boolean }],
  earnings:      { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Caregiver', caregiverSchema);
