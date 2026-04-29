const Patient = require('../models/Patient');

async function getAllPatients(req, res) {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: patients });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch patients', error: err.message });
  }
}

async function getPatientById(req, res) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    return res.json({ success: true, data: patient });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid patient id', error: err.message });
  }
}

async function createPatient(req, res) {
  try {
    const created = await Patient.create(req.body);
    return res.status(201).json({ success: true, message: 'Patient created', data: created });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to create patient', error: err.message });
  }
}

async function updatePatient(req, res) {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    return res.json({ success: true, message: 'Patient updated', data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to update patient', error: err.message });
  }
}

async function deletePatient(req, res) {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    return res.json({ success: true, message: 'Patient deleted' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to delete patient', error: err.message });
  }
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};

