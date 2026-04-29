const express = require('express');
const {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} = require('../controllers/prescriptionController');

const router = express.Router();

router.get('/', getAllPrescriptions);
router.get('/:id', getPrescriptionById);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

module.exports = router;

