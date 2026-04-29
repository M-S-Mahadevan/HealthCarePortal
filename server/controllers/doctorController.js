const Doctor = require('../models/Doctor');

async function getAllDoctors(req, res) {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: doctors });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch doctors', error: err.message });
  }
}

async function getDoctorById(req, res) {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, data: doctor });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid doctor id', error: err.message });
  }
}

async function createDoctor(req, res) {
  try {
    const created = await Doctor.create(req.body);
    return res.status(201).json({ success: true, message: 'Doctor created', data: created });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to create doctor', error: err.message });
  }
}

async function updateDoctor(req, res) {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    return res.json({ success: true, message: 'Doctor updated', data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to update doctor', error: err.message });
  }
}

async function deleteDoctor(req, res) {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, message: 'Doctor deleted' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to delete doctor', error: err.message });
  }
}

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};

