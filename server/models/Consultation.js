const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    diagnosis: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true },
    followUpDate: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);

