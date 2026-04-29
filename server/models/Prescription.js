const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    instructions: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);

