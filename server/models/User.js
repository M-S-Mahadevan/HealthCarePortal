const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin'], default: 'admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

