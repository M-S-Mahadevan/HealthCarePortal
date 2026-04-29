const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

dotenv.config();

async function seed() {
  try {
    await connectDB(process.env.MONGO_URI);

    const existingPatients = await Patient.countDocuments();
    const existingDoctors = await Doctor.countDocuments();

    const created = { patients: 0, doctors: 0 };

    if (existingPatients === 0) {
      await Patient.insertMany([
        {
          fullName: 'Aarav Sharma',
          age: 22,
          gender: 'male',
          phone: '9876543210',
          bloodGroup: 'O+',
          address: 'Mumbai, Maharashtra',
          medicalHistory: 'Seasonal allergies'
        },
        {
          fullName: 'Priya Verma',
          age: 20,
          gender: 'female',
          phone: '9123456780',
          bloodGroup: 'B+',
          address: 'Pune, Maharashtra',
          medicalHistory: 'Asthma (mild)'
        }
      ]);
      created.patients = 2;
    }

    if (existingDoctors === 0) {
      await Doctor.insertMany([
        {
          fullName: 'Dr. Neha Kapoor',
          specialization: 'General Physician',
          experience: 6,
          phone: '9000011111',
          email: 'neha.kapoor@example.com',
          availability: 'Mon-Fri 10:00-16:00'
        },
        {
          fullName: 'Dr. Rohan Mehta',
          specialization: 'Dermatologist',
          experience: 8,
          phone: '9000022222',
          email: 'rohan.mehta@example.com',
          availability: 'Tue-Sat 12:00-18:00'
        }
      ]);
      created.doctors = 2;
    }

    // eslint-disable-next-line no-console
    console.log('Seed complete:', { created, existing: { patients: existingPatients, doctors: existingDoctors } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();

