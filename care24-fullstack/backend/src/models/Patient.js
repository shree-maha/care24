const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  age:         { type: Number, required: true },
  relation:    { type: String },
  bloodGroup:  { type: String },
  conditions:  { type: String },
  allergies:   { type: String },
  emergencyContact: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
