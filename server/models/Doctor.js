const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    availability: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);

