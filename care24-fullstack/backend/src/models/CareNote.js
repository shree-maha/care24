const mongoose = require('mongoose');

const careNoteSchema = new mongoose.Schema({
  booking:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  caregiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Caregiver', required: true },
  note:      { type: String, required: true },
  type:      { type: String, enum: ['update', 'complete', 'alert'], default: 'update' },
}, { timestamps: true });

module.exports = mongoose.model('CareNote', careNoteSchema);
