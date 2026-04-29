## Integrated Health Care Portal — Folder/File Plan

This project follows the exact structure you requested.

integrated-healthcare-portal/
  client/
    index.html                 - Landing page + navigation
    patients.html              - Patients CRUD UI
    doctors.html               - Doctors CRUD UI
    appointments.html          - Appointments CRUD UI + booking (patient+doctor select)
    consultations.html         - Consultations CRUD UI (linked to appointment)
    prescriptions.html         - Prescriptions CRUD UI (linked to consultation)
    admin.html                 - Admin login/register + dashboard (counts + latest appointments)
    css/
      style.css                - Shared clean UI styling
    js/
      config.js                - API_BASE_URL (local dev)
      api.js                   - Reusable fetch() helpers + JWT header support
      app.js                   - Shared nav rendering, auth helpers, page init
      patients.js              - Page logic for patients.html
      doctors.js               - Page logic for doctors.html
      appointments.js          - Page logic for appointments.html
      consultations.js         - Page logic for consultations.html
      prescriptions.js         - Page logic for prescriptions.html
      admin.js                 - Page logic for admin.html (auth + dashboard)
  server/
    server.js                  - Express app bootstrap + route mounting
    package.json               - Dependencies + npm scripts
    .env.example               - Environment variables template
    config/
      db.js                    - MongoDB connection via Mongoose
    models/
      Patient.js               - Patient schema/model
      Doctor.js                - Doctor schema/model
      Appointment.js           - Appointment schema/model (refs Patient/Doctor)
      Consultation.js          - Consultation schema/model (ref Appointment)
      Prescription.js          - Prescription schema/model (ref Consultation)
      User.js                  - User schema/model (admin auth)
    controllers/
      patientController.js     - Patient CRUD handlers
      doctorController.js      - Doctor CRUD handlers
      appointmentController.js - Appointment CRUD handlers + populate names
      consultationController.js- Consultation CRUD handlers
      prescriptionController.js- Prescription CRUD handlers
      authController.js        - Register/login (bcrypt + JWT)
    routes/
      patientRoutes.js         - /api/patients routes
      doctorRoutes.js          - /api/doctors routes
      appointmentRoutes.js     - /api/appointments routes
      consultationRoutes.js    - /api/consultations routes
      prescriptionRoutes.js    - /api/prescriptions routes
      authRoutes.js            - /api/auth routes
    middleware/
      authMiddleware.js        - JWT verification (Authorization: Bearer <token>)
      roleMiddleware.js        - Role guard (admin)
  README.md                    - Setup, API list, MongoDB Compass, deployment notes

