const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caregiver:   { type: mongoose.Schema.Types.ObjectId, ref: 'Caregiver', required: true },
  patient:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  service:     { type: String, required: true },
  careType:    { type: String, enum: ['one-time', 'recurring', 'long-term'], default: 'one-time' },
  date:        { type: Date, required: true },
  time:        { type: String, required: true },
  duration:    { type: Number, required: true },
  address:     { type: String },
  notes:       { type: String },
  status:      { type: String, enum: ['pending', 'accepted', 'active', 'completed', 'cancelled', 'rejected'], default: 'pending' },
  totalAmount: { type: Number },
  progress:    { type: Number, default: 0 },
  referenceId: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate reference ID
bookingSchema.pre('save', function (next) {
  if (!this.referenceId) {
    this.referenceId = 'C24-' + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
