const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Consultation = require('./models/Consultation');
const Prescription = require('./models/Prescription');

const app = express();

app.use(express.json());

const defaultAllowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];
const extraAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...extraAllowedOrigins]);

function isAllowedOrigin(origin) {
  if (allowedOrigins.has(origin)) return true;
  try {
    const url = new URL(origin);
    if (['localhost', '127.0.0.1'].includes(url.hostname)) return true;
    if (url.hostname.endsWith('.vercel.app')) return true;
  } catch (e) {
    return false;
  }
  return false;
}

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.get('/api/health', (req, res) => {
  return res.json({ success: true, message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

app.get('/api/admin/dashboard', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [patients, doctors, appointments, consultations, prescriptions] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Consultation.countDocuments(),
      Prescription.countDocuments()
    ]);

    const latestAppointments = await Appointment.find()
      .populate('patientId', 'fullName')
      .populate('doctorId', 'fullName specialization')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      data: {
        counts: { patients, doctors, appointments, consultations, prescriptions },
        latestAppointments
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load dashboard', error: err.message });
  }
});

app.use((req, res) => {
  return res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Server error'
  });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

