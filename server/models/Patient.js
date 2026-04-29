const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    phone: { type: String, required: true, trim: true },
    bloodGroup: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    medicalHistory: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);

