const Prescription = require('../models/Prescription');

async function getAllPrescriptions(req, res) {
  try {
    const prescriptions = await Prescription.find()
      .populate({
        path: 'consultationId',
        populate: {
          path: 'appointmentId',
          populate: [
            { path: 'patientId', select: 'fullName' },
            { path: 'doctorId', select: 'fullName specialization' }
          ]
        }
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: prescriptions });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch prescriptions', error: err.message });
  }
}

async function getPrescriptionById(req, res) {
  try {
    const prescription = await Prescription.findById(req.params.id).populate({
      path: 'consultationId',
      populate: {
        path: 'appointmentId',
        populate: [
          { path: 'patientId', select: 'fullName' },
          { path: 'doctorId', select: 'fullName specialization' }
        ]
      }
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    return res.json({ success: true, data: prescription });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid prescription id', error: err.message });
  }
}

async function createPrescription(req, res) {
  try {
    const created = await Prescription.create(req.body);
    return res.status(201).json({ success: true, message: 'Prescription created', data: created });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to create prescription', error: err.message });
  }
}

async function updatePrescription(req, res) {
  try {
    const updated = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    return res.json({ success: true, message: 'Prescription updated', data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to update prescription', error: err.message });
  }
}

async function deletePrescription(req, res) {
  try {
    const deleted = await Prescription.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    return res.json({ success: true, message: 'Prescription deleted' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to delete prescription', error: err.message });
  }
}

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
};

