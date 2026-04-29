const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentDate: { type: String, required: true, trim: true },
    appointmentTime: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);

