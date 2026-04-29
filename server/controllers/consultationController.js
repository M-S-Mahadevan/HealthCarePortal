const Consultation = require('../models/Consultation');

async function getAllConsultations(req, res) {
  try {
    const consultations = await Consultation.find()
      .populate({
        path: 'appointmentId',
        populate: [
          { path: 'patientId', select: 'fullName' },
          { path: 'doctorId', select: 'fullName specialization' }
        ]
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: consultations });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch consultations', error: err.message });
  }
}

async function getConsultationById(req, res) {
  try {
    const consultation = await Consultation.findById(req.params.id).populate({
      path: 'appointmentId',
      populate: [
        { path: 'patientId', select: 'fullName' },
        { path: 'doctorId', select: 'fullName specialization' }
      ]
    });

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }
    return res.json({ success: true, data: consultation });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid consultation id', error: err.message });
  }
}

async function createConsultation(req, res) {
  try {
    const created = await Consultation.create(req.body);
    return res.status(201).json({ success: true, message: 'Consultation created', data: created });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to create consultation', error: err.message });
  }
}

async function updateConsultation(req, res) {
  try {
    const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    return res.json({ success: true, message: 'Consultation updated', data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to update consultation', error: err.message });
  }
}

async function deleteConsultation(req, res) {
  try {
    const deleted = await Consultation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }
    return res.json({ success: true, message: 'Consultation deleted' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to delete consultation', error: err.message });
  }
}

module.exports = {
  getAllConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation
};

