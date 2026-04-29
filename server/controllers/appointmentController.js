const Appointment = require('../models/Appointment');

async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'fullName phone')
      .populate('doctorId', 'fullName specialization phone')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: err.message });
  }
}

async function getAppointmentById(req, res) {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName phone')
      .populate('doctorId', 'fullName specialization phone');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    return res.json({ success: true, data: appointment });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid appointment id', error: err.message });
  }
}

async function createAppointment(req, res) {
  try {
    const created = await Appointment.create(req.body);
    return res.status(201).json({ success: true, message: 'Appointment created', data: created });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to create appointment', error: err.message });
  }
}

async function updateAppointment(req, res) {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.json({ success: true, message: 'Appointment updated', data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to update appointment', error: err.message });
  }
}

async function deleteAppointment(req, res) {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    return res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to delete appointment', error: err.message });
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};

